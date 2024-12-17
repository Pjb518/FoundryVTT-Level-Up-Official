// eslint-disable-next-line @typescript-eslint/naming-convention
export default async function _onCombatControl(event) {
	event.preventDefault();

	const combat = this.viewed;
	const ctrl = event.currentTarget;

	if (ctrl.getAttribute('disabled')) return;

	ctrl.setAttribute('disabled', true);
	const fn = combat[ctrl.dataset.control];

	let rollMode = event.shiftKey ? CONFIG.A5E.ROLL_MODE.ADVANTAGE : CONFIG.A5E.ROLL_MODE.NORMAL;

	const reverseAlt = game.settings.get('a5e', 'reverseInitiativeAltBehavior');
	const defaultAltBehavior = game.settings.get('a5e', 'reverseAltBehavior');

	let skipRollDialog = defaultAltBehavior ? !event.altKey : event.altKey;
	skipRollDialog = reverseAlt ? !skipRollDialog : skipRollDialog;

	rollMode = event.metaKey || event.ctrlKey ? CONFIG.A5E.ROLL_MODE.DISADVANTAGE : rollMode;

	if (fn) {
		await fn.bind(combat)({
			rollOptions: {
				rollMode,
				skipRollDialog,
			},
		});
	}

	ctrl.removeAttribute('disabled');
}
