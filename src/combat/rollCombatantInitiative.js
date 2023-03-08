/**
 * Roll initiative for this particular combatant.
 *
 * @return {Roll}  The Roll instance to use for the combatant.
 */
export default async function rollInitiative(options = {}) {
  const roll = await this.getInitiativeRoll(options);
  return this.update({ initiative: roll.total });
}
