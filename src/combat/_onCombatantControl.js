export default async function _onCombatantControl(event, target) {
  event.preventDefault();
  event.stopPropagation();

  const { combatantId } = target.closest("[data-combatant-id]")?.dataset ?? {};
  const combatant = this.viewed?.combatants.get(combatantId);
  if (!combatant) return;

  let rollMode = event.shiftKey
    ? CONFIG.A5E.ROLL_MODE.ADVANTAGE
    : CONFIG.A5E.ROLL_MODE.NORMAL;

  rollMode =
    event.metaKey || event.ctrlKey
      ? CONFIG.A5E.ROLL_MODE.DISADVANTAGE
      : rollMode;

  const reverseAlt = game.settings.get("a5e", "reverseInitiativeAltBehavior");
  const defaultAltBehavior = game.settings.get("a5e", "reverseAltBehavior");

  let skipRollDialog = defaultAltBehavior ? !event.altKey : event.altKey;
  skipRollDialog = reverseAlt ? !skipRollDialog : skipRollDialog;

  switch (target.dataset.action) {
    case "pingCombatant":
      return this._onPingCombatant(combatant);
    case "panToCombatant":
      return this._onPanToCombatant(combatant);
    case "rollInitiative":
      return this._onRollInitiative(combatant);
    case "toggleDefeated":
      return this._onToggleDefeatedStatus(combatant);
    case "toggleHidden":
      return this._onToggleHidden(combatant);
  }
}
