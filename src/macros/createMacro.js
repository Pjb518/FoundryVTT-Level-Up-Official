/**
 * Create a Macro when dropping an Item on the macro bar. If a macro already exists for the item,
 * use the existing macro.
 *
 * @param {object} data  The dropped data.
 * @param {number} slot  The macro hot bar slot to use.
 */
// eslint-disable-next-line consistent-return
export default async function createMacro(data, slot) {
  const item = await fromUuid(data.uuid);
  const action = item.actions.get(data.actionId);

  if (foundry.utils.isEmpty(item) || item.parent === null) {
    return ui.notifications.warn(game.i18n.localize('A5E.ActionWarningNoMacrosForUnownedItems'));
  }

  // Create the macro command
  let command;
  if (data.actionId) {
    command = `game.a5e.macros.activateActionMacro("${item.name}", "${data.actionId}");`;
  } else {
    command = `game.a5e.macros.activateItemMacro("${item.name}");`;
  }

  let macro = game.macros.find((m) => {
    const sameCommand = (m.name === item.name) && (m.command === command);
    const perms = m.ownership?.default === 3 || m.ownership?.[game.user.id] === 3;

    return sameCommand && perms;
  });

  if (!macro) {
    macro = await Macro.create({
      name: `${item.name} ${action ? `(${(action.name)})` : ''}`,
      type: 'script',
      scope: 'actor',
      img: (action && action?.img) ? action.img : item.img,
      command,
      flags: { 'a5e.itemMacro': true }
    });
  }

  await game.user.assignHotbarMacro(macro, slot);
}
