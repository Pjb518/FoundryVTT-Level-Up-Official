/**
 * A helper function for converting a raw ability score value to a modifier.
 *
 * @param {number} abilityScore  The value of the ability score to convert.
 * @returns {number}             The ability modifier for the provided ability score value.
 */
export default function getBaseAbilityMod(abilityScore) {
  return Math.floor((abilityScore - 10) / 2);
}
