import type { InexactPartial } from 'fvtt-types/utils';

import terms = foundry.dice.terms;

class BaseDie extends terms.Die {
	declare options: BaseDie.Options;

	static override MODIFIERS = {
		...super.MODIFIERS,
		adv: 'rollMode',
		dis: 'rollMode',
	};

	async rollMode(modifier: string) {
		const expansion = this.options.pending?.rollMode;
		if (!expansion) return;
		const { count, adv, size } = expansion;
		const sets = Array(count + 1);
		let targetTotal = adv ? -Infinity : Infinity;
		const selectedResults = this.results.filter((r) => r.active);
		for (const index of sets.keys()) {
			const startIndex = size * index;
			sets[index] = { results: selectedResults.slice(startIndex, startIndex + size) };
			sets[index].total = sets[index].results.reduce((total, { result }) => total + result, 0);
			targetTotal = Math[adv ? 'max' : 'min'](targetTotal, sets[index].total);
		}
		let kept = false;
		for (const { results, total } of sets) {
			if (!kept && total === targetTotal) kept = true;
			else
				results.forEach((r) => {
					r.discarded = true;
					r.active = false;
				});
		}

		delete this.options.pending!.rollMode;
	}

	expandRollMode() {
		if (this.options.pending?.rollMode) return;
		if (typeof this.number !== 'number') return;

		let match: RegExpMatchArray | null;
		for (const modifier of this.modifiers) {
			match = modifier.match(/^(adv|dis)(\d*)/i);
			if (match) break;
		}

		if (!match) return;

		const [, token, matchedCount] = match;
		const count = Number.parseInt(matchedCount || '1', 10);

		const adv = token.toLowerCase() === 'adv';
		const size = this.number;
		this._number = (count + 1) * size;
		this.options.pending ??= {};
		this.options.pending.rollMode = { adv, count, size };
	}

	override async _evaluateAsync(
		options: InexactPartial<terms.DiceTerm.EvaluationOptions> = {},
	): Promise<this> {
		// Have to duplicate most of the core code here in order to insert advantage expansion at the point where we have
		// the evaluated complex number term but before the terms are passed back to the resolver.
		for (const roll of [this._faces, this._number]) {
			if (!(roll instanceof foundry.dice.Roll)) continue;
			// @ts-expect-error
			if (this._root) roll._root = this._root;
			await roll.evaluate(options);
		}

		// @ts-expect-error
		if (Math.abs(this.number) > 999) {
			throw new Error('You may not evaluate a DiceTerm with more than 999 requested results');
		}

		this.expandRollMode();

		// @ts-expect-error
		if (this.resolver && !this._id) await this.resolver.addTerm(this);
		// @ts-expect-error
		for (let n = this.results.length; n < Math.abs(this.number); n++) await this.roll(options);

		await this._evaluateModifiers();
		return this;
	}

	protected override async _evaluateModifiers(): Promise<void> {
		// Rerolls need to apply before advantage selects which expanded results to keep.
		// Since adv/dis internally calls roll and modifies the count, they must be evaluated first in order for subsequent
		// modifiers to operate on the correct dice.
		const [rerolls, rest] = this.modifiers.partition((m) => /^rr?/i.test(m));
		const [remaining, selection] = rest.partition((m) => /^(adv|dis)\d*/i.test(m));
		if (selection.length) this.modifiers = rerolls.concat(selection, remaining);
		return super._evaluateModifiers();
	}
}

declare namespace BaseDie {
	interface Options extends terms.DiceTerm.Options {
		pending?: { rollMode?: { adv: boolean; count: number; size: number } };
	}
}

export { BaseDie };
