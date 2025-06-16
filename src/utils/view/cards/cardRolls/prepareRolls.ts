import { prepareCheckRollData } from "./prepareCheckRollData.ts";
import zip from "#utils/zip.ts";

const ROLL_SORT_KEY_MAP = {
  attack: 0,
  damage: 1,
  healing: 2,
  abilityCheck: 3,
  skillCheck: 4,
  savingThrow: 5,
  toolCheck: 6,
  generic: 7,
};

export function prepareRolls(message) {
  const { rolls } = message;
  const messageData = message.system ?? {};

  if (messageData.rollData) {
    return zip(rolls, messageData.rollData).sort(
      (a, b) => ROLL_SORT_KEY_MAP[a[1]?.type] - ROLL_SORT_KEY_MAP[b[1]?.type],
    );
  }

  if (rolls?.length) {
    return [[rolls[0], prepareCheckRollData(messageData)]];
  }

  return [];
}
