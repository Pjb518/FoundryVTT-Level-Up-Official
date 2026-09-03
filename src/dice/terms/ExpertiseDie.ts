import { BaseDie } from './BaseDie.ts';

import terms = foundry.dice.terms;

import type { InexactPartial } from 'fvtt-types/utils';
import { A5E } from '../../config.ts';

class ExpertiseDie extends BaseDie {
	declare options: ExpertiseDie.Options;

	constructor({ number = 1, faces = 4, ...args }: InexactPartial<terms.Die.TermData> = {}) {
		if (number > 1) {
			ui.notifications.warn("Expertise number can't be greater than 1");
			number = 1;
		}

		if (faces > 5) {
			ui.notifications.warn("Expertise faces can't be greater than 5");
			faces = 5;
		}

		faces = A5E.expertiseDiceSidesMap[faces] ?? 4;

		super({ number, faces, ...args });
	}

	/** ===================================== */
	//  Expertise Die Methods
	/** ===================================== */
	// TODO:
	increase(value: number) {}

	// TODO:
	descrease(value: number) {}

	/** ===================================== */
	//  Getters
	/** ===================================== */
	override get flavor() {
		return 'Expertise';
	}

	get isValid() {
		return this.faces! >= 1 && this.faces! <= 5;
	}
}

declare namespace ExpertiseDie {
	interface Options extends BaseDie.Options {}
}

export { ExpertiseDie };
