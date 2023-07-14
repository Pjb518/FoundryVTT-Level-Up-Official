export default function getKeyPressAsOptions(keyPressStore, { reverseAlt = false } = {}) {
  const { Shift, Control, Alt } = keyPressStore;

  const altBehavior = game.settings.get('a5e', 'reverseAltBehavior');

  let rollMode = Shift
    ? CONFIG.A5E.ROLL_MODE.ADVANTAGE
    : CONFIG.A5E.ROLL_MODE.NORMAL;

  rollMode = Control ? CONFIG.A5E.ROLL_MODE.DISADVANTAGE : rollMode;

  let skipRollDialog = altBehavior ? !Alt : Alt;
  skipRollDialog = reverseAlt ? !skipRollDialog : skipRollDialog;

  return {
    skipRollDialog,
    rollMode
  };
}
