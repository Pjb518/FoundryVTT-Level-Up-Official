export default function prepareAttackRolls(rolls) {
  if (!rolls.length) return [];

  const [key, roll] = rolls[0];

  return [[key, roll]];
}
