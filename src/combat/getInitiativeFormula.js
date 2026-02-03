import getDefaultInitiativeFormula from "./getDefaultInitiativeFormula";

import GenericRollDialog from "#view/dialogs/initializers/GenericRollDialog.svelte.ts";
import InitiativeRollDialog from "#view/dialogs/actor/InitiativeRollDialog.svelte";
import SimpleInitiativeRollDialog from "#view/dialogs/actor/SimpleInitiativeRollDialog.svelte";

/**
 * Override the default Initiative formula to customize special behaviors of the system.
 * See Combat._getInitiativeFormula for more detail.
 * @returns {string}  Final initiative formula for the actor.
 */
export default async function getInitiativeFormula(options) {
  if (options?.skipRollDialog) {
    return getDefaultInitiativeFormula(this.actor, options);
  }

  const title = game.i18n.format("A5E.initiative.promptTitle", {
    name: this.name,
  });
  const component = game.settings.get("a5e", "simpleInitiative")
    ? SimpleInitiativeRollDialog
    : InitiativeRollDialog;

  const dialog = new GenericRollDialog(this.actor, title, component, {}, options, {
    width: 530,
  });

  await dialog.render(true);

  const { rollFormula } = await dialog.promise;

  return rollFormula;
}
