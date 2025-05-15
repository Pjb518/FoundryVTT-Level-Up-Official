import type { SkillCheckRollData } from '../../../dataModels/item/actions/ActionRollsDataModel';

export default function prepareSkillChecks(
	rolls: [string, SkillCheckRollData][],
): [string, SkillCheckRollData][] {
	const counts: Record<string, number> = {};

	if (!rolls.length) return [];

	return rolls.map(([key, roll]) => {
		roll.skill ??= 'acr';

		if (!roll.label) {
			const label = game.i18n.format('A5E.skillLabels.checks.skillSpecific', {
				skill: game.i18n.localize(CONFIG.A5E.skills[roll.skill]),
			});

			counts[roll.skill] ??= 0;
			counts[roll.skill] += 1;

			// @ts-expect-error
			roll.defaultLabel = `${label} #${counts[roll.skill]}`;
		}

		return [key, roll];
	});
}
