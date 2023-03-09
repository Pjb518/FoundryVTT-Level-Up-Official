/* eslint-disable no-underscore-dangle */
export default async function _onCombatControl(event) {
  event.preventDefault();

  const combat = this.viewed;
  const ctrl = event.currentTarget;

  if (ctrl.getAttribute('disabled')) return;

  ctrl.setAttribute('disabled', true);
  const fn = combat[ctrl.dataset.control];

  let rollMode = event.shiftKey
    ? CONFIG.A5E.ROLL_MODE.ADVANTAGE
    : CONFIG.A5E.ROLL_MODE.NORMAL;

  rollMode = (event.metaKey || event.ctrlKey) ? CONFIG.A5E.ROLL_MODE.DISADVANTAGE : rollMode;

  if (fn) {
    await fn.bind(combat)({
      rollOptions: {
        rollMode,
        skipRollDialog: game.settings.get(
          'a5e',
          'reverseInitiativeAltBehavior'
        ) ? !event.altKey : event.altKey
      }
    });
  }

  ctrl.removeAttribute('disabled');
}
