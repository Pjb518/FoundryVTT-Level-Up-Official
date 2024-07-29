import type { ItemA5e } from '../../../documents/item/item';

import prepareAbilityChecks from './prepareAbilityChecks';
import prepareAttackRolls from './prepareAttackRolls';
import prepareDamageRolls from './prepareDamageRolls';
import prepareGenericRolls from './prepareGenericRolls';
import prepareHealingRolls from './prepareHealingRolls';
import prepareSavingThrows from './prepareSavingThrows';
import prepareSkillChecks from './prepareSkillChecks';
import prepareToolChecks from './prepareToolChecks';

const rollHandlerMap = {
  abilityCheck: prepareAbilityChecks,
  attack: prepareAttackRolls,
  damage: prepareDamageRolls,
  generic: prepareGenericRolls,
  healing: prepareHealingRolls,
  savingThrow: prepareSavingThrows,
  skillCheck: prepareSkillChecks,
  toolCheck: prepareToolChecks
} as const;

export type RollHandlerMap = typeof rollHandlerMap;

export type RollHandlerTypes = keyof RollHandlerMap;

export type RollHandlerReturnType = {
  abilityCheck?: ReturnType<typeof prepareAbilityChecks>
  attack?: ReturnType<typeof prepareAttackRolls>,
  damage?: ReturnType<typeof prepareDamageRolls>,
  generic?: ReturnType<typeof prepareGenericRolls>,
  healing?: ReturnType<typeof prepareHealingRolls>,
  savingThrow?: ReturnType<typeof prepareSavingThrows>,
  skillCheck?: ReturnType<typeof prepareSkillChecks>,
  toolCheck?: ReturnType<typeof prepareToolChecks>
};

export default function prepareRolls(item: ItemA5e, actionId: string) {
  const { rolls } = (item.actions.get(actionId)!);

  const rollsByType = Object.entries(rolls ?? {}).reduce((acc, [key, roll]) => {
    acc[roll.type] ??= [];
    acc[roll.type].push([key, roll]);

    return acc;
  }, {} as Record<RollHandlerTypes, any[]>);

  return (Object.entries(rollsByType) as Array<[RollHandlerTypes, any[]]>)
    .reduce((acc, [rollType, _rolls]) => {
      if (typeof rollHandlerMap[rollType] === 'function') {
        // @ts-expect-error TODO: Fix this type at some point
        acc[rollType] = (rollHandlerMap[rollType](_rolls)) ?? [];
      }

      return acc;
    }, {} as RollHandlerReturnType); // TODO: Make these properties optional
}
