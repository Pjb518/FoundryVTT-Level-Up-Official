export default function getKeyPressAsOptions(keyPressStore, { reverseAlt = false } = {}) {
  const { Shift, Control, Alt } = keyPressStore;

  let rollMode = Shift
    ? CONFIG.A5E.ROLL_MODE.ADVANTAGE
    : CONFIG.A5E.ROLL_MODE.NORMAL;

  rollMode = Control ? CONFIG.A5E.ROLL_MODE.DISADVANTAGE : rollMode;

  return {
    skipRollDialog: reverseAlt ? !Alt : Alt,
    rollMode
  };
}
