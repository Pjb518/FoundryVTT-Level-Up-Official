import getDeterministicBonus from '../dice/getDeterministicBonus';

export default function calculatePassiveScore(skill, rollData) {
  const { ability } = skill;

  return getDeterministicBonus([
    10,
    skill.deterministicBonus,
    skill.bonuses.passive,
    rollData.abilities[ability]?.check?.deterministicBonus ?? 0,

    // Remove the double addition of the global check bonus
    `- ${getDeterministicBonus(rollData.bonuses.abilities.check, rollData)}`
  ].filter(Boolean).join(' + '), rollData);
}
