import type { AnyObject, EmptyObject, InexactPartial } from 'fvtt-types/utils';
import { D20Die } from '../terms/D20Die.ts';
import { BaseRoll } from './BaseRoll.ts';

import terms = foundry.dice.terms;

import { A5E } from '../../config.ts';
import { ExpertiseDie } from '../terms/ExpertiseDie.ts';

class D20Roll<D extends AnyObject = EmptyObject> extends BaseRoll {
	declare options: D20Roll.Options;

	constructor(formula: string, data?: D, options?: D20Roll.Options) {
		// @ts-expect-error
		super(formula, data, options);

		this.#createD20Die();
		if (!this.options.configured) this.configureModifiers();
	}

	/** ===================================== */
	//  Getters
	/** ===================================== */
	get d20(): D20Die | undefined {
		if (!(this.terms[0] instanceof terms.Die)) return undefined;
		if (!(this.terms[0] instanceof D20Die)) this.#createD20Die();
		return this.terms[0] as D20Die;
	}

	set d20(die: D20Die) {
		if (!(die instanceof D20Die)) {
			throw new Error(
				// @ts-expect-error
				`D20 die must be an instance of ${D20Die.name}, instead a ${die.constructor.name} was provided.`,
			);
		}

		this.terms[0] = die;
	}

	get hasAdv() {
		return this.options.rollMode === D20Roll.ROLL_MODE.ADVANTAGE;
	}

	get hasDis() {
		return this.options.rollMode === D20Roll.ROLL_MODE.DISADVANTAGE;
	}

	get isCrit() {
		return this.d20?.isCritSuccess;
	}

	get isFumble() {
		return this.d20?.isCritFail;
	}

	get validD20Roll() {
		return this.d20 instanceof D20Die && this.d20.isValid;
	}

	/** ===================================== */
	//  Methods
	/** ===================================== */
	#createD20Die() {
		if (this.terms[0] instanceof D20Die) return;
		if (!(this.terms[0] instanceof terms.Die)) return;
		const { number, faces, ...data } = this.terms[0];
		this.terms[0] = new D20Die({ ...data, number, faces });
	}

	configureModifiers() {
		if (!this.validD20Roll) return;
		if (!this.d20) return;

		if (this.options.rollMode === undefined) this.options.rollMode = D20Roll.ROLL_MODE.NORMAL;

		let min = this.options.min;
		if (this.options.specialModes?.reliableTalent) min = Math.max(min ?? -Infinity, 10);

		// Apply special modifiers
		this.d20.applyFlag('elvenAccuracy', this.options.specialModes?.elvenAccuracy === true);

		// Apply other modifiers
		this.d20.applyRollMode(this.options.rollMode);
		this.d20.applyRange({ min, max: this.options.max || Infinity });

		// Apply expertise
		if (this.options.expertise) {
			const expTerm = new ExpertiseDie({ faces: this.options.expertise });
			const found = this.terms.findSplice((t) => t instanceof ExpertiseDie, expTerm);

			if (!found) {
				this.terms.push(new terms.OperatorTerm({ operator: '+' }));
				this.terms.push(new ExpertiseDie({ faces: this.options.expertise }));
			}
		}

		this.resetFormula();
		this.options.configured = true;
	}

	/** ===================================== */
	//  Static Methods
	/** ===================================== */
	static ROLL_MODE = {
		NORMAL: A5E.ROLL_MODE.NORMAL,
		ADVANTAGE: A5E.ROLL_MODE.ADVANTAGE,
		DISADVANTAGE: A5E.ROLL_MODE.DISADVANTAGE,
	};

	static override fromConfig(config: D20Roll.Config, process: BaseRoll.RollSetup) {
		const formula = [new CONFIG.Dice.D20Die().formula].concat(config.parts ?? []).join(' + ');

		config.options ??= {};
		config.options.critSuccess ??= D20Die.CRIT_SUCCESS_TOTAL;
		config.options.critFail ??= D20Die.CRIT_FAIL_TOTAL;
		config.options.expertise ??= 0;

		// TODO: Add special modes from process
		config.options.specialModes ??= {};

		config.options.target ??= process.target;
		return new this(formula, config.data, config.options);
	}

	static fromRoll(roll: Roll) {
		const newRoll = new this(roll.formula, roll.data, roll.options);
		Object.assign(newRoll, roll);
		return newRoll;
	}

	static override mergeOptions(
		original = {} as Partial<D20Roll.Options>,
		other = {} as Partial<D20Roll.Options>,
	) {
		const merged = super.mergeOptions(original, other) as Partial<D20Roll.Options>;

		merged.rollMode = original.rollMode ?? other.rollMode;
		merged.expertise = original.expertise ?? other.expertise;
		merged.max = Math.min(original.max ?? Infinity, other.max ?? Infinity);
		merged.min = Math.max(original.min ?? -Infinity, other.min ?? -Infinity);
		return merged;
	}
}

declare namespace D20Roll {
	interface Config extends BaseRoll.Config {
		options?: Options;
	}

	interface _Options extends BaseRoll._Options, D20Die.Options {
		configured?: boolean;
		expertise?: number;
	}

	interface Options extends InexactPartial<_Options> {}
}

export { D20Roll };
