import type { PressedKeys } from "../../stores/pressedKeysStore.svelte.ts";

type Options = {
  readonly reverseAlt: boolean;
};

export function getKeyPressAsOptions(
  keyPressStore: PressedKeys,
  { reverseAlt = false } = {} as Options,
) {
  const { Shift, Control, Alt } = keyPressStore;

  const altBehavior = false; // game.settings.get('a5e', 'reverseAltBehavior');

  let rollMode = Shift
    ? CONFIG.A5E.ROLL_MODE.ADVANTAGE
    : CONFIG.A5E.ROLL_MODE.NORMAL;

  rollMode = Control ? CONFIG.A5E.ROLL_MODE.DISADVANTAGE : rollMode;

  let skipRollDialog = altBehavior ? !Alt : Alt;
  skipRollDialog = reverseAlt ? !skipRollDialog : skipRollDialog;

  return {
    skipRollDialog,
    rollMode,
  };
}
