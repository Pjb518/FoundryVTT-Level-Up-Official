import type { AbilityCheckRollData } from '../../../dataModels/item/actions/ActionRollsDataModel';

export default function prepareAbilityChecks(
  rolls: [string, AbilityCheckRollData][]
): [string, AbilityCheckRollData][] {
  const counts: Record<string, number> = {};

  if (!rolls.length) return [];

  return rolls.map(([key, roll]) => {
    roll.ability ??= 'str';

    if (!roll.label) {
      const label = game.i18n.format('A5E.AbilityCheckSpecific', {
        ability: game.i18n.localize(CONFIG.A5E.abilities[roll.ability])
      });

      counts[roll.ability] ??= 0;
      counts[roll.ability] += 1;

      // @ts-expect-error
      roll.defaultLabel = `${label} #${counts[roll.ability]}`;
    }

    return [key, roll];
  });
}
