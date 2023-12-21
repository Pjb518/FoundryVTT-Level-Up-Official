import getDefaultInitiativeFormula from './getDefaultInitiativeFormula';

import GenericRollDialog from '../apps/dialogs/initializers/GenericRollDialog';
import InitiativeRollDialog from '../apps/dialogs/InitiativeRollDialog.svelte';

/**
 * Override the default Initiative formula to customize special behaviors of the system.
 * See Combat._getInitiativeFormula for more detail.
 * @returns {string}  Final initiative formula for the actor.
 */
export default async function getInitiativeFormula(options) {
  if (options?.skipRollDialog) {
    return getDefaultInitiativeFormula(this.actor, options);
  }

  const title = game.i18n.format('A5E.InitiativePromptTitle', { name: this.name });

  const dialog = new GenericRollDialog(
    this,
    title,
    InitiativeRollDialog,
    {},
    options,
    { width: 530 }
  );

  await dialog.render(true);

  const { rollFormula } = await dialog.promise;

  return rollFormula;
}
