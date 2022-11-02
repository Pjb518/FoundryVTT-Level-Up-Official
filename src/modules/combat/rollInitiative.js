/**
 * Roll initiative for one or multiple Combatants within the Combat entity.
 *
 * @param {string|string[]} ids                 A Combatant id or Array of ids for which to roll.
 * @param {object} [options={}]                 Additional options which modify how initiative
 *                                              rolls are created or presented.
 * @param {string|null} [options.formula]       A non-default initiative formula to roll. Otherwise
 *                                              the system default is used.
 * @param {boolean} [options.updateTurn=true]   Update the Combat turn after adding new initiative
 *                                              scores to keep the turn on the same Combatant.
 * @param {object} [options.messageOptions={}]  Additional options with which to customize created
 *                                              Chat Messages.
 *
 * @return {Promise<Combat>}  A promise which resolves to the updated Combat entity once updates
 *                            are complete.
 */
export default async function rollInitiative(
  /* eslint-ignore no-restricted syntax */

  _ids,
  { updateTurn = true, messageOptions = {} } = {}
) {
  // Structure input data
  const ids = typeof _ids === 'string' ? [_ids] : _ids;
  const currentId = this.combatant?.id;
  const rollMode = messageOptions.rollMode || game.settings.get('core', 'rollMode');

  // Iterate over Combatants, performing an initiative roll for each
  const updates = [];
  const messages = [];

  for (const [i, id] of ids.entries()) {
    let roll;

    // Get Combatant data (non-strictly)
    const combatant = this.combatants.get(id);
    if (!combatant?.isOwner) return results;

    // Produce an initiative roll for the Combatant
    try {
      roll = await combatant.getInitiativeRoll();
    } catch {
      continue;
    }

    updates.push({ _id: id, initiative: roll.total });

    // Construct chat message data
    const messageData = foundry.utils.mergeObject({
      speaker: {
        scene: this.scene.id,
        actor: combatant.actor?.id,
        token: combatant.token?.id,
        alias: combatant.name
      },
      flavor: game.i18n.format('COMBAT.RollsInitiative', { name: combatant.name }),
      flags: { 'core.initiativeRoll': true }
    }, messageOptions);

    const chatData = await roll.toMessage(messageData, {
      create: false,
      rollMode: combatant.hidden && (rollMode === 'roll') ? 'gmroll' : rollMode
    });

    // Play 1 sound for the whole rolled set
    if (i > 0) chatData.sound = null;
    messages.push(chatData);
  }

  if (!updates.length) return this;

  // Update multiple combatants
  await this.updateEmbeddedDocuments('Combatant', updates);

  // Ensure the turn order remains with the same combatant
  if (updateTurn) {
    await this.update({ turn: this.turns.findIndex((t) => t.id === currentId) });
  }

  // Create multiple chat messages
  await ChatMessage.implementation.create(messages);
  return this;
}
