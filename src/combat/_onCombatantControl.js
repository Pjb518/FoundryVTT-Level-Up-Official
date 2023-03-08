/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
export default async function _onCombatantControl(event) {
  event.preventDefault();
  event.stopPropagation();

  const btn = event.currentTarget;
  const li = btn.closest('.combatant');
  const combat = this.viewed;
  const c = combat.combatants.get(li.dataset.combatantId);

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
          skipRollDialog: event.altKey
        }
      });

    // Actively ping the Combatant
    case 'pingCombatant': return this._onPingCombatant(c);
  }
}
