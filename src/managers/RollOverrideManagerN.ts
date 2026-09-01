import type { RollModeData } from '../dataModels/fields/RollModeField.ts';

type ResolveOptions = {
	targetSrc?: any;
	others?: { src: any; type: string }[];
};

class RollOverrideManager {
	init() {}

	static resolveExpertiseDie(src: any, baseDie: number, options = {} as ResolveOptions) {}

	/**
	 * This is the final resolver, it takes the rolled roll Mode,
	 * existing effects and target effects into account
	 */
	static resolveRollMode(src: any, baseRollMode: number, options = {} as ResolveOptions) {
		const rollCounts = src.rollModeCounts as RollModeData | undefined;

		const values: number[] = [src.rollMode, baseRollMode];
		const sources = {
			advantages: [...(rollCounts?.advantages?.sources ?? [])],
			disadvantages: [...(rollCounts?.disadvantages?.sources ?? [])],
			overrides: [rollCounts?.override?.source || ''],
		};

		// Add target data
		const targetSrc = options.targetSrc;
		if (targetSrc?.rollModeCounts) {
			const tRollCounts = targetSrc.rollModeCounts as RollModeData;
			values.push(targetSrc.rollMode || 0);

			sources.advantages.push(...tRollCounts.advantages.sources.map((s) => `Target - ${s}`));
			sources.disadvantages.push(...tRollCounts.disadvantages.sources.map((s) => `Target - ${s}`));
			if (tRollCounts.override.value)
				sources.overrides.push(`Target - ${tRollCounts.override.source}` || '');
		}

		// Add other data
		const others = options.others ?? [];
		others.forEach((other) => {
			const otherSrc = other.src;
			const oRollCounts = otherSrc?.rollModeCounts as RollModeData | undefined;
			if (!oRollCounts) return;

			values.push(otherSrc.rollMode || 0);

			const type = other.type.capitalize();
			sources.advantages.push(...oRollCounts.advantages.sources.map((s) => `${type} - ${s}`));
			sources.disadvantages.push(...oRollCounts.disadvantages.sources.map((s) => `${type} - ${s}`));
			if (oRollCounts.override.value) {
				sources.overrides.push(`${type} - ${oRollCounts.override.source}` || '');
			}
		});

		// Get final value
		const hasAdvantage = values.includes(1);
		const hasDisadvantage = values.includes(-1);

		let result = 0;
		if (hasAdvantage && hasDisadvantage) result = 0;
		else if (hasAdvantage && !hasDisadvantage) result = 1;
		else if (!hasAdvantage && hasDisadvantage) result = -1;
		else result = 0;

		// Create source string
		sources.overrides = sources.overrides.filter((s) => !!s);
		const sourceString = RollOverrideManager.sourcesToString(baseRollMode, result, sources);

		// Return
		return { value: result, source: sourceString };
	}

	static sourcesToString(base: number, result: number, sources: Record<string, string[]>) {
		const { advantages: adv = [], disadvantages: dis = [], overrides } = sources;

		let baseString = '';
		let overrideString = '';
		let advString = '';
		let disString = '';
		let resString = '';

		if (overrides.length) {
			overrideString = `<p> <strong>Override:</strong> ${overrides.join(', ')}</p>`;
		}

		if (adv.length) advString = `<p> <strong>Advantage:</strong> ${adv.join(', ')}</p>`;
		if (dis.length) disString = `<p> <strong>Disdvantage:</strong> ${dis.join(', ')}</p>`;

		if (base === CONFIG.A5E.ROLL_MODE.ADVANTAGE) baseString = 'Advantage';
		else if (base === CONFIG.A5E.ROLL_MODE.DISADVANTAGE) baseString = 'Disadvantage';
		else baseString = 'Normal';

		if (result === CONFIG.A5E.ROLL_MODE.ADVANTAGE) resString = 'Advantage';
		else if (result === CONFIG.A5E.ROLL_MODE.DISADVANTAGE) resString = 'Disadvantage';
		else resString = 'Normal';

		return `<div class='u-text-xs u-text-left'>
      <p> <strong>Base Roll Mode:</strong> ${baseString}</p>
      ${overrideString ? overrideString : ''}
      ${advString}
      ${disString}
      <p> <strong>Result:</strong> ${resString}</p>
    </div>
    `;
	}
}

export { RollOverrideManager };

window.RollOverrideManager = RollOverrideManager;
