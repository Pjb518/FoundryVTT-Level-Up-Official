import prepareAttackRolls from './prepareAttackRolls';
import prepareAbilityChecks from './prepareAbilityChecks';
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
};

export default function preparePrompts(rolls) {
  const rollsByType = Object.entries(rolls ?? {}).reduce((acc, [key, roll]) => {
    acc[roll.type] ??= [];
    acc[roll.type].push([key, roll]);

    return acc;
  }, {});

  return Object.entries(rollsByType).reduce((acc, [rollType, _rolls]) => {
    if (typeof rollHandlerMap[rollType] === 'function') {
      acc[rollType] = rollHandlerMap[rollType](_rolls) ?? [];
    }

    return acc;
  }, {});
}
