export default async function _onCombatControl(event) {
  event.preventDefault();

  const combat = this.viewed;
  const ctrl = event.currentTarget;

  if (ctrl.getAttribute('disabled')) return;

  ctrl.setAttribute('disabled', true);
  const fn = combat[ctrl.dataset.control];

  if (fn) {
    await fn.bind(combat)({
      rollOptions: {
        skipRollDialog: event.altKey
      }
    });
  }

  ctrl.removeAttribute('disabled');
}
