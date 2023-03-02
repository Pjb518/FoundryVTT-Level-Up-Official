export default function getKeyPressAsOptions(keyPressStore) {
  const { ShiftLeft, ControlLeft, AltLeft } = keyPressStore;

  let rollMode = ShiftLeft
    ? CONFIG.A5E.ROLL_MODE.ADVANTAGE
    : CONFIG.A5E.ROLL_MODE.NORMAL;
  rollMode = ControlLeft ? CONFIG.A5E.ROLL_MODE.DISADVANTAGE : rollMode;

  return {
    skipRollDialog: AltLeft,
    rollMode

  };
}
