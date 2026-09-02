import type { InexactPartial } from 'fvtt-types/utils';
import { BaseDie } from './BaseDie.ts';

import terms = foundry.dice.terms;

class D20Die extends BaseDie {
	declare options: D20Die.Options;

	constructor({ number = 1, faces = 20, ...args }: InexactPartial<terms.Die.TermData> = {}) {
		super({ number, faces, ...args });
	}

	/** ===================================== */
	//  Getters
	/** ===================================== */
	get isCritSuccess() {
		if (!this.isValid || !this._evaluated) return undefined;
		if (!Number.isNumeric(this.options.critSuccess)) return undefined;
		return this.total! >= (this.options.critSuccess || D20Die.CRIT_SUCCESS_TOTAL);
	}

	get isCritFail() {
		if (!this.isValid || !this._evaluated) return undefined;
		if (!Number.isNumeric(this.options.critSuccess)) return undefined;
		return this.total! <= (this.options.critFail || D20Die.CRIT_FAIL_TOTAL);
	}

	get isValid() {
		return this.faces === 20;
	}

	/** ===================================== */
	//  D20 Methods
	/** ===================================== */
	applyRollMode(rollMode: number) {
		this.options.rollMode = rollMode;
		this.modifiers.findSplice(
			(m) => m.startsWith('adv') || m.startsWith('dis') || m === 'kh' || m === 'kl',
		);

		this.number = 1;
		if (rollMode === 0) return;
		const isAdv = rollMode === 1;
		this.modifiers.push(
			`${isAdv ? 'adv' : 'dis'}${isAdv && this.options.specialModes?.elvenAccuracy ? '2' : ''}`,
		);
	}

	applyFlag(flag: string, value: boolean) {
		this.options.specialModes ??= {};
		this.options.specialModes[flag] = value;
	}

	applyRange(values: { min: number | undefined; max: number | undefined }) {
		Object.entries(values).forEach(([key, value]) => {
			if (!Number.isFinite(value)) value = undefined;
			this.options[key] = value;

			const mod = key.substring(0, 3);
			this.modifiers.findSplice((m) => m.startsWith(mod));
			if (value) this.modifiers.push(`${mod}${value}`);
		});
	}

	/** ===================================== */
	//  Static Methods
	/** ===================================== */

	static CRIT_SUCCESS_TOTAL = 20;
	static CRIT_FAIL_TOTAL = 1;
}

declare namespace D20Die {
	interface Options extends BaseDie.Options {
		critSuccess?: number;
		critFail?: number;
		max?: number;
		min?: number;
		rollMode?: number;

		// Special options
		specialModes?: {
			elvenAccuracy?: boolean;
			reliableTalent?: boolean;
		};
	}
}

export { D20Die };
