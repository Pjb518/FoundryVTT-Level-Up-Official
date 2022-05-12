import getDeterministicBonus from '../dice/getDeterministicBonus';

export default function calculatePassiveScore(skill, rollData) {
  const { ability } = skill;

  return getDeterministicBonus(
    10
    + skill.deterministicBonus
    + skill.bonuses.passive
    + rollData.abilities[ability].check.deterministicBonus
  );
}
