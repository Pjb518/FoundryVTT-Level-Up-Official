import type { RollModeData } from '../dataModels/fields/RollModeField.ts';

class RollOverrideManager {
	constructor() {}

	init() {}

	/**
	 * This is the final resolver, it takes the rolled roll Mode,
	 * existing effects and target effects into account
	 */
	static resolveRollMode(src: any, rollMode: number, targetSrc?: any) {
		const rollCounts = src.rollModeCounts as RollModeData;
		if (!rollCounts && !targetSrc) return { value: rollMode, source: '' };

		const { override, advantages, disadvantages } = rollCounts;

		// Take care of override if target exists
		if (targetSrc) {
			// Check if targetSrc has counts
			const targetRollCounts = targetSrc.rollModeCounts as RollModeData;
			if (!targetRollCounts) return { value: rollMode, source: '' };

			if (override.value && targetRollCounts.override.value) {
				const result = Math.sign(override.value + targetRollCounts.override.value);
				return {
					value: result,
					source: RollOverrideManager.sourcesToString(rollMode, result, {
						overrides: [override.source!, `Target - ${targetRollCounts.override.source}`],
					}),
				};
			}
		} else if (override.value) {
			// Take care of override for self
			return {
				value: override.value,
				source: RollOverrideManager.sourcesToString(rollMode, override.value, {
					overrides: [override.source!],
				}),
			};
		}

		// Take care of target rollOverride
		if (targetSrc) {
			const targetRollCounts = targetSrc.rollModeCounts as RollModeData;
			const targetRollMode = targetSrc.rollMode as number;

			const srcRollMode = src.rollMode as number;

			const values = [targetRollMode, srcRollMode, rollMode];
			let result = rollMode;
			if (values.includes(-1) && values.includes(+1)) result = 0;
			else Math.sign(values.reduce((sum, val) => sum + val, 0));

			return {
				value: result,
				source: RollOverrideManager.sourcesToString(rollMode, result, {
					advantages: [
						...advantages.sources,
						...targetRollCounts.advantages.sources.map((s) => `Target - ${s}`),
					],
					disadvantages: [
						...disadvantages.sources,
						...targetRollCounts.disadvantages.sources.map((s) => `Target - ${s}`),
					],
				}),
			};
		}

		// Regular result
		const result = Math.sign((src.rollMode as number) + rollMode);

		return {
			value: result,
			source: RollOverrideManager.sourcesToString(rollMode, result, {
				advantages: advantages.sources,
				disadvantages: disadvantages.sources,
			}),
		};
	}

	resolveRollModeWT(src: any, rollMode: number, targetSrc: any) {}

	static sourcesToString(base: number, result: number, sources: Record<string, string[]>) {
		const { advantages: adv = [], disadvantages: dis = [], overrides } = sources;

		let baseString = '';
		let overrideString = '';
		let advString = '';
		let disString = '';
		let resString = '';

		if (overrides) {
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
      ${overrideString ? '' : advString}
      ${overrideString ? '' : disString}
      <p> <strong>Result:</strong> ${resString}</p>
    </div>
    `;
	}
}

export { RollOverrideManager };

window.RollOverrideManager = RollOverrideManager;
