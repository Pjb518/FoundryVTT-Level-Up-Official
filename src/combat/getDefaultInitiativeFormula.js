import constructD20RollFormula from '../modules/dice/constructD20RollFormula';
import getExpertiseDieSize from '../modules/utils/getExpertiseDieSize';

export default function getDefaultInitiativeFormula(actor, options = {}) {
  const skillKey = options?.skillKey;
  const abilityKey = options?.abilityKey ?? 'dex';
  const ability = actor.system.abilities[abilityKey];
  const { initiative } = actor.system.attributes;
  const skill = actor.system.skills[skillKey];

  return constructD20RollFormula({
    actor,
    rollMode: options.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL,
    modifiers: [
      {
        label: 'Initiative Bonus',
        value: initiative.bonus
      },
      {
        label: `${game.i18n.localize(CONFIG.A5E.abilities[abilityKey])} Mod`,
        value: ability?.check.mod
      },
      {
        label: `${game.i18n.localize(CONFIG.A5E.skills[skillKey])} Mod`,
        value: skill?.mod
      },
      {
        label: `${game.i18n.localize(CONFIG.A5E.abilities[abilityKey])} Check Bonus`,
        value: ability?.check.bonus
      },
      {
        label: `${game.i18n.localize(CONFIG.A5E.skills[skillKey])} Check Bonus`,
        value: skill?.bonuses.check
      },
      {
        label: 'Global Check Bonus',
        value: actor.system.bonuses.abilities.check
      },
      {
        label: 'Global Skill Bonus',
        value: skillKey ? actor.system.bonuses.abilities.skill : null
      },
      {
        label: 'Expertise Die',
        value: getExpertiseDieSize(options.expertiseDice ?? initiative.expertiseDice)
      },
      {
        value: options.situationalMods
      }
    ]
  });
}
