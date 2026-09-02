import type { InexactPartial } from 'fvtt-types/utils';

import terms = foundry.dice.terms;

class BaseRoll extends Roll {
	declare options: BaseRoll.Options;

	/** ===================================== */
	//  Getters
	/** ===================================== */
	get isFailure() {
		if (!this._evaluated) return undefined;
		if (!Number.isNumeric(this.options?.target)) return undefined;
		return this.total! < this.options!.target!;
	}

	get isSuccess() {
		if (!this._evaluated) return undefined;
		if (!Number.isNumeric(this.options?.target)) return undefined;
		return this.total! >= this.options!.target!;
	}

	/** ===================================== */
	//  Evaluation
	/** ===================================== */
	override async evaluate(options?: BaseRoll.Options): Promise<Roll.Evaluated<this>> {
		this.modifyDiceTerms(options);
		return super.evaluate(options);
	}

	override evaluateSync(options?: Roll.Options): Roll.Evaluated<this> {
		this.modifyDiceTerms(options);
		return super.evaluateSync(options);
	}

	modifyDiceTerms(options = {} as BaseRoll.Options) {
		if (!this._evaluated || (!options.maximize && !options.minimize)) return;

		this.terms = this.terms.map((term) => {
			if (
				(term instanceof terms.DiceTerm || term instanceof terms.PoolTerm) &&
				term.modifiers.length
			) {
				const minimize = !options.maximize;

				const number = 0;
				if (term instanceof terms.DiceTerm) this.modifyTerm(term, { minimize });
				else this.modifyPoolTerm(term, { minimize });

				if (Number.isFinite(number))
					return new terms.NumericTerm({ number, options: term.options });
			}

			return term;
		});
	}

	modifyTerm(die: terms.DiceTerm, { minimize = false } = {}) {
		if (!die.number || !Number.isFinite(die.number)) return null;
		if (!die.faces || !Number.isFinite(die.faces)) return null;
		if (!die.modifiers.length) return null;

		for (let n = die.results.length; n < Math.abs(die.number); n++) {
			die.results.push({ active: true, result: minimize ? Math.min(1, die.faces) : die.faces });
		}

		// @ts-expect-error
		die._evaluated = true;
		this.applyMinMaxModifiers(die);
		return die.total;
	}

	modifyPoolTerm(pool: terms.PoolTerm, { minimize = false } = {}) {
		pool.evaluate({ maximize: !minimize, minimize });
		this.applyMinMaxModifiers(pool);
		return pool.total;
	}

	/** ===================================== */
	//  Helpers
	/** ===================================== */
	applyMinMaxModifiers(term: terms.DiceTerm | terms.PoolTerm) {
		const cls = term.constructor as unknown as terms.DiceTerm | terms.PoolTerm;
		// @ts-expect-error
		const union = Object.keys(cls.MODIFIERS)
			.sort((a, b) => b.length - a.length)
			.join('|');

		const pattern = new RegExp(`(${union})[^A-z\\s()+\\-*/]*`, 'gi');
		for (const sequence of term.modifiers.map((m) => m.toLowerCase())) {
			for (const [matched, command] of sequence.matchAll(pattern)) {
				// @ts-expect-error
				let fn = cls.MODIFIERS[command];
				if (typeof fn === 'string') fn = term[fn];
				if (typeof fn === 'function' && !(fn instanceof foundry.utils.AsyncFunction))
					fn.call(term, matched);
			}
		}
	}

	invert() {
		// Add "0 +" to the start of formulas that don't begin with a numeric term
		if (!(this.terms[0] instanceof terms.NumericTerm)) {
			this.terms.unshift(
				new terms.NumericTerm({ number: 0 }),
				new terms.OperatorTerm({ operator: '+' }),
			);
		}
		// Otherwise remove "0 -" from formulas that start with that
		// @ts-expect-error
		else if (this.terms[0]?.number === 0 && this.terms[1]?.operator === '-') {
			this.terms.splice(0, 2);
		}

		// Starting numeric terms should be directly inverted
		if (this.terms[0] instanceof terms.NumericTerm) this.terms[0].number *= -1;

		// Invert all addition & subtraction operators
		this.terms = this.terms.map((term) => {
			if (term instanceof terms.OperatorTerm) {
				if (term.operator === '+') term.operator = '-';
				else if (term.operator === '-') term.operator = '+';
			}
			return term;
		});

		if (this._evaluated) this._total! *= -1;
		this.resetFormula();
		return this;
	}

	simplify() {
		this.dice.forEach((die) => {
			const n = die._number;
			if (n instanceof BaseRoll && n.isDeterministic) die._number = n.evaluateSync().total;

			const f = die._faces;
			if (f instanceof BaseRoll && f.isDeterministic) die._faces = f.evaluateSync().total;

			// Preserve flavor.
			// @ts-expect-error
			if (f.terms?.[0]?.flavor) die.options.flavor = f.terms[0].flavor;
		});

		this.resetFormula();
	}

	/** ===================================== */
	//  Static Methods
	/** ===================================== */
	static fromConfig(config: BaseRoll.Config, setup: BaseRoll.RollSetup) {
		const formula = (config.parts ?? []).join(' + ');
		config.options ??= {};
		config.options.target ??= setup.target;
		return new BaseRoll(formula, config.data ?? {}, config.options);
	}

	static constructParts(parts: Record<string, any>, data = {}) {
		const processed: string[] = [];
		Object.entries(parts ?? {}).forEach(([key, value]) => {
			if (!value && value !== 0) return;
			processed.push(`@${key}`);

			foundry.utils.setProperty(
				data,
				key,
				foundry.utils.getType(value) === 'string'
					? BaseRoll.replaceFormulaData(value, data, { missing: '0' })
					: value,
			);
		});

		return { parts: processed, data };
	}

	static mergeConfigs(original: Partial<BaseRoll.Config>, other = {} as Partial<BaseRoll.Config>) {
		if (other.data) {
			original.data ??= {};
			Object.assign(original.data, other.data);
		}

		if (other.parts?.length) {
			original.parts ??= [];
			original.parts.unshift(...other.parts);
		}

		if (other.options) {
			original.options = this.mergeOptions(original.options, other.options);
		}

		return original;
	}

	static mergeOptions(
		original = {} as Partial<BaseRoll.Options>,
		other = {} as Partial<BaseRoll.Options>,
	) {
		return foundry.utils.mergeObject(original, other, { inplace: false });
	}
}

declare namespace BaseRoll {
	interface _Options extends Roll._Options {
		/** Target value to mark success or faliure of roll */
		target?: number | undefined;
	}

	interface Options extends InexactPartial<_Options> {}

	type Config = {
		parts?: string[];
		data?: Record<string, never>;
		situational?: boolean;
		options?: Options;
	};

	type RollSetup = {
		rolls: BaseRoll.Config[];
		evaluate?: boolean;
		event?: Event;
		hookNames?: string[];
		subject?: foundry.abstract.Document.Any;
		target?: number;
	};
}

export { BaseRoll };
