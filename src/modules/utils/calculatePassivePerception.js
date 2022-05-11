import getDeterministicBonus from '../dice/getDeterministicBonus';

export default function calculatePassivePerception(actorData) {
  const { abilities, skills } = actorData.data;
  const perception = skills.prc;

  return getDeterministicBonus(
    10
    + perception.deterministicBonus
    + perception.bonuses.passive
    + abilities.wis.check.mod
  );
}
