import type { AnyObject, EmptyObject, InexactPartial } from 'fvtt-types/utils';
import { localize } from '#utils/localization/localize.ts';
import type { BaseDie } from '../terms/BaseDie.ts';
import { BaseRoll } from './BaseRoll.ts';

import terms = foundry.dice.terms;

class DamageRoll<D extends AnyObject = EmptyObject> extends BaseRoll {
	declare options: DamageRoll.Options;

	constructor(formula: string, data: D, options = {} as DamageRoll.Options) {
		// @ts-expect-error
		super(formula, data, options);

		if (!this.options.preprocessed) this.preprocessFormula();
		if (!this.options.configured) this.configure(options);
	}

	/** ===================================== */
	//  Getters
	/** ===================================== */
	get isCrit() {
		return this.options.isCrit === true;
	}

	/** ===================================== */
	//  Methods
	/** ===================================== */
	configure({ critical = {} } = {} as DamageRoll.Options) {
		if (this.options.configured) return;

		// Handle critical
		if (this.isCrit) {
			const newTerms = [] as terms.RollTerm[];
			this.terms.forEach((term, idx) => {
				if (term instanceof terms.OperatorTerm) newTerms.push(term);
				else newTerms.push(...this.#applyCriticalTerm(term, critical, idx));
			});

			// Add bonus Crit Damage
			if (critical.bonusDamage) {
				newTerms.push(
					new terms.OperatorTerm({ operator: '+' }),
					...(new DamageRoll(critical.bonusDamage, this.data).terms ?? []),
				);
			}

			this.terms = newTerms;
		}

		this.resetFormula();
		this.options.configured = true;
	}

	preprocessFormula() {
		this.resetFormula();
		this.options.preprocessed = true;
	}

	/** ===================================== */
	//  Evaluation
	/** ===================================== */
	override async evaluate(options?: DamageRoll.Options): Promise<Roll.Evaluated<this>> {
		const result = await super.evaluate(options);
		this.#configurePostEvaluation(options);
		return result;
	}

	override evaluateSync(options?: DamageRoll.Options): Roll.Evaluated<this> {
		const result = super.evaluateSync(options);
		this.#configurePostEvaluation(options);
		return result;
	}

	#configurePostEvaluation(options?: DamageRoll.Options) {
		if (this.isCrit) {
			const critical = this.options.critical ?? options?.critical ?? {};
			const newTerms = [] as terms.RollTerm[];
			this.terms.forEach((term, idx) => {
				if (term instanceof terms.OperatorTerm) newTerms.push(term);
				else newTerms.push(...this.#applyCriticalTermPost(term, critical, idx));
			});

			// Apply double damage dice modifier
			if (critical.multiplyDiceTotal && this._evaluated) {
				const multiplier = Math.max(1, (critical.multiplier ?? 1) - 1);
				const diceTotal = this.dice.reduce((acc, die) => acc + die.total!, 0) * multiplier;
				newTerms.push(
					new terms.OperatorTerm({ operator: '+' }),
					new terms.NumericTerm({
						number: diceTotal,
						options: { flavor: localize('A5E.CritDamage') },
					}).evaluate() as terms.NumericTerm,
				);
			}

			this.terms = newTerms;
		}

		this.resetFormula();
	}

	/** ===================================== */
	//  Crit Methods
	/** ===================================== */
	#applyCriticalTermPost(term: terms.RollTerm, critical: DamageRoll.CritConfiguration, index) {
		return [term];
	}

	#applyCriticalTerm(term: terms.RollTerm, critical: DamageRoll.CritConfiguration, index: number) {
		if (term instanceof terms.DiceTerm && term._number instanceof Roll) {
			if (term._number.isDeterministic) term.number = term._number.evaluateSync().total;
			else if (term.modifiers.length) return [term];
		}

		// @ts-expect-error
		term.options.critical = true;

		const multiplier = critical.multiplier ?? 1;
		const bonusDice = critical.bonusDice && !index ? critical.bonusDice : 0;

		if (term instanceof terms.NumericTerm) {
			// Possibly make this it's own term to join with dice multiplication
			if (critical.multiplyNumeric) term.number *= multiplier;
			return [term];
		}

		if (critical.powerfulCritical) {
			const clone = terms.RollTerm.fromData(term.toJSON()).evaluate({
				maximize: true,
			}) as terms.RollTerm;

			clone.options.flavor = term.flavor?.toLocaleLowerCase() ?? 'Powerful Critical';
			return this.#placeCritical(term, [clone], index);
		}

		if (term instanceof terms.DiceTerm && !term.modifiers.length) {
			if (critical.multiplyDice || critical.bonusDice) {
				term.alter(multiplier, bonusDice);
				return [term];
			}

			// Maximize term
			if (critical.maximizeDice) return [term.evaluate({ maximize: true }) as terms.RollTerm];

			return [term];
		}

		const copies = multiplier - 1 + bonusDice;
		if (!term.isDeterministic && copies > 0) {
			const clones = Array.from({ length: copies }, () =>
				terms.RollTerm.fromData(foundry.utils.deepClone(term.toJSON())),
			);

			return this.#placeCritical(term, clones, index);
		}

		return [term];
	}

	#bound = (t: terms.RollTerm) =>
		t instanceof terms.OperatorTerm && DamageRoll.#BINDING_OPERATORS.has(t.operator);

	#placeCritical(term: terms.RollTerm, extras: terms.RollTerm[], index: number) {
		const prev = this.terms[index - 1];
		const next = this.terms[index + 1];

		if (this.#bound(prev) || this.#bound(next)) {
			const options = foundry.utils.deepClone(term.options);
			const group = [term];

			extras.forEach((extra) => {
				group.push(new terms.OperatorTerm({ operator: '+' }), extra);
			});

			group.forEach((t) => {
				t.options.flavor = '';
			});

			return [terms.ParentheticalTerm.fromTerms(group, options)];
		}

		const sign = prev instanceof terms.OperatorTerm ? prev.operator : '+';
		const placed = [term];
		extras.forEach((extra) => {
			placed.push(new terms.OperatorTerm({ operator: '+' }), extra);
		});
		return placed;
	}

	/** ===================================== */
	//  Static Methods
	/** ===================================== */
	static #BINDING_OPERATORS = new Set(['*', '/', '%']);

	static override fromConfig(config: DamageRoll.Config, setup: DamageRoll.RollSetup) {
		if (setup.critical) {
			config = foundry.utils.deepClone(config);
			config.options ??= {};
			config.options.critical = foundry.utils.mergeObject(
				setup.critical,
				config.options.critical ?? {},
				{ inplace: false },
			);
		}

		return super.fromConfig(config, setup);
	}
}

declare namespace DamageRoll {
	interface Config extends BaseRoll.Config {
		options?: Options;
	}

	interface _Options extends BaseRoll._Options, BaseDie.Options {
		configured?: boolean;
		critical: CritConfiguration;
		isCrit?: boolean;
		preprocessed?: boolean;
	}

	interface Options extends InexactPartial<_Options> {}

	interface RollSetup extends BaseRoll.RollSetup {
		critical?: CritConfiguration;
	}

	interface CritConfiguration {
		multiplier?: number;
		bonusDice?: number;
		bonusDamage?: string; // Not Implemented
		maximizeDice?: boolean;
		multiplyDice?: boolean;
		multiplyDiceTotal?: boolean;
		multiplyNumeric?: boolean;
		powerfulCritical?: boolean;
	}
}

export { DamageRoll };
