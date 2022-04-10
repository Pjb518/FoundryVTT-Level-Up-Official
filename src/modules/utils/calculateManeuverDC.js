import getDeterministicBonus from '../dice/getDeterministicBonus';

export default function calculateManeuverDC(actorData) {
  const { abilities, attributes, bonuses } = actorData.data;

  return getDeterministicBonus(
    8
    + attributes.prof
    + (parseInt(bonuses.maneuverDC, 10) || 0)
    + Math.max(abilities.str.check.mod, abilities.dex.check.mod)
  );
}
