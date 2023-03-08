import getDefaultInitiativeFormula from './getDefaultInitiativeFormula';

import InitiativeRollDialog from '../apps/dialogs/initializers/InitiativeRollDialog';

/**
 * Override the default Initiative formula to customize special behaviors of the system.
 * See Combat._getInitiativeFormula for more detail.
 * @returns {string}  Final initiative formula for the actor.
 */
export default async function getInitiativeFormula(options) {
  if (options?.skipRollDialog) {
    return getDefaultInitiativeFormula(this.actor, options);
  }

  const dialog = new InitiativeRollDialog(this, options);
  await dialog.render(true);

  const { rollFormula } = await dialog.promise;

  return rollFormula;
}
