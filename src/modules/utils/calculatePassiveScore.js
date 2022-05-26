import getDeterministicBonus from '../dice/getDeterministicBonus';

export default function calculatePassiveScore(skill, rollData) {
  const { ability } = skill;

  return getDeterministicBonus(
    10
    + Number(skill.deterministicBonus)
    + Number(skill.bonuses.passive)
    + Number(rollData.abilities[ability].check.deterministicBonus)
    // Remove the double addition of the global check bonus
    - Number(getDeterministicBonus(rollData.bonuses.abilities.check, rollData))
  );
}
