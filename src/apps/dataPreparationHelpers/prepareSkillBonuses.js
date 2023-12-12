export default function prepareSkillBonuses(actor, skillKey) {
  const bonuses = actor.system.bonuses.skills;
  const skill = actor.system.skills[skillKey];

  if (!skill) return [];

  const skillBonuses = Object.entries(bonuses).filter(
    ([, { context, formula }]) => {
      if (!formula) return false;
      const { skills, requiresProficiency, passiveOnly } = context;
      if (!skills.includes(skillKey)) return false;

      // Remove passive bonuses
      if (passiveOnly) return false;
      if (requiresProficiency && !skill.proficient) return false;

      return true;
    }
  );

  const counts = {};

  return skillBonuses.map(([key, skillBonus]) => {
    if (!skillBonus.label) {
      const label = game.i18n.format('A5E.SkillBonusSpecific', {
        skill: game.i18n.localize(CONFIG.A5E.skills[skillKey] ?? '')
      });

      counts[skillKey] ??= 0;
      counts[skillKey] += 1;

      skillBonus.defaultLabel = `${label} #${counts[skillKey]}`;
    }

    return [key, skillBonus];
  });
}
