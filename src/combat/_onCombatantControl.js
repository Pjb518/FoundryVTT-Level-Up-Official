/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
// eslint-disable-next-line @typescript-eslint/naming-convention
export default async function _onCombatantControl(event) {
  event.preventDefault();
  event.stopPropagation();

  const btn = event.currentTarget;
  const li = btn.closest('.combatant');
  const combat = this.viewed;
  const c = combat.combatants.get(li.dataset.combatantId);

  let rollMode = event.shiftKey
    ? CONFIG.A5E.ROLL_MODE.ADVANTAGE
    : CONFIG.A5E.ROLL_MODE.NORMAL;

  rollMode = (event.metaKey || event.ctrlKey) ? CONFIG.A5E.ROLL_MODE.DISADVANTAGE : rollMode;

  const reverseAlt = game.settings.get('a5e', 'reverseInitiativeAltBehavior');
  const defaultAltBehavior = game.settings.get('a5e', 'reverseAltBehavior');

  let skipRollDialog = defaultAltBehavior ? !event.altKey : event.altKey;
  skipRollDialog = reverseAlt ? !skipRollDialog : skipRollDialog;

  // Switch control action
  // eslint-disable-next-line default-case
  switch (btn.dataset.control) {
    // Toggle combatant visibility
    case 'toggleHidden': return c.update({ hidden: !c.hidden });

    // Toggle combatant defeated flag
    case 'toggleDefeated': return this._onToggleDefeatedStatus(c);

    // Roll combatant initiative
    case 'rollInitiative':
      return combat.rollInitiative([c.id], {
        rollOptions: {
          rollMode,
          skipRollDialog
        }
      });

    // Actively ping the Combatant
    case 'pingCombatant': return this._onPingCombatant(c);

    // Pan view to combatant (Non-GM only)
    case 'panToCombatant': return this._onPanToCombatant(c);
  }
}
