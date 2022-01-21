/**
 * Create a Macro when dropping an Item on the macro bar. If a macro already exists for the item,
 * use the existing macro.
 *
 * @param {object} data  The dropped data.
 * @param {number} slot  The macro hot bar slot to use.
 *
 * @returns {Promise}
 */
export default async function createMacro(data, slot) {
  if (data.type !== 'Item') return null;
  if (!('data' in data)) return ui.notifications.warn('A5E.ActionWarningNoMacrosForUnownedItems');

  const item = data.data;

  // Create the macro command
  const command = `game.a5e.macros.activateItemMacro("${item.name}");`;

  let macro = game.macros.find((m) => (m.name === item.name) && (m.data.command === command));

  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: 'script',
      img: item.img,
      command,
      flags: { 'a5e.itemMacro': true }
    });
  }

  game.user.assignHotbarMacro(macro, slot);
  return false;
}
