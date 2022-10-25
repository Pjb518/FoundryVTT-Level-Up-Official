/**
 * Create a Macro when dropping an Item on the macro bar. If a macro already exists for the item,
 * use the existing macro.
 *
 * @param {object} data  The dropped data.
 * @param {number} slot  The macro hot bar slot to use.
 *
 * @returns {Promise}
 */
export default async function createMacro({ type, uuid }, slot) {
  if (type !== 'Item') return null;

  const item = await fromUuid(uuid);

  if (foundry.utils.isEmpty(item) || item.parent === null) {
    return ui.notifications.warn(game.i18n.localize('A5E.ActionWarningNoMacrosForUnownedItems'));
  }

  // Create the macro command
  const command = `game.a5e.macros.activateItemMacro("${item.name}");`;

  let macro = game.macros.find((m) => (m.name === item.name) && (m.data.command === command));

  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: 'script',
      scope: 'actor',
      img: item.img,
      command,
      flags: { 'a5e.itemMacro': true }
    });
  }

  game.user.assignHotbarMacro(macro, slot);
  return false;
}
