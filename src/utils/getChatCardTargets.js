/**
 * Find the currently selected tokens on the canvas.
 *
 * @returns {Actor[]} An Array of Actor documents, if any
 */
export default function getChatCardTargets() {
  let targets = canvas.tokens.controlled?.filter((target) => !!target.actor) ?? [];

  if (!targets.length && game.user.character) {
    targets = targets.concat(game.user.character?.getActiveTokens() ?? []);
  }

  if (!targets.length) {
    ui.notifications.warn(game.i18n.localize('A5E.ActionWarningNoSelectedTokens'));
  }

  return targets;
}
