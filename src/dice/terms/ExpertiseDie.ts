import type { InexactPartial } from 'fvtt-types/utils';
import { A5E } from '../../config.ts';
import { BaseDie } from './BaseDie.ts';

import terms = foundry.dice.terms;

class ExpertiseDie extends BaseDie {
	declare options: ExpertiseDie.Options;

	constructor({
		number = 1,
		faces = 4,
		expertise = 1,
		...args
	}: InexactPartial<ExpertiseDie.TermData> = {}) {
		if (number > 1) {
			ui.notifications.warn("Expertise number can't be greater than 1");
			number = 1;
		}

		if (faces > 20 || faces < 4) {
			ui.notifications.warn("Expertise faces can't be greater than 20 or less than 4");
			faces = Math.clamp(faces, 4, 20);
		}

		if (expertise > 5 || expertise < 1) {
			ui.notifications.warn("Expertise can't be greater than 5 or less than 1");
			expertise = Math.clamp(expertise, 1, 5);
		}

		faces = A5E.expertiseDiceSidesMap[expertise] ?? faces ?? 4;

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
		// @ts-expect-error
		return _loc('A5E.expertiseDie.title');
	}

	get isValid() {
		return this.faces! >= 1 && this.faces! <= 5;
	}
}

declare namespace ExpertiseDie {
	interface TermData extends terms.Die.TermData {
		expertise?: number;
	}

	interface Options extends BaseDie.Options {}
}

export { ExpertiseDie };
