import prepareCheckRollData from './prepareCheckRollData';
import zip from '../../../utils/zip';

const ROLL_SORT_KEY_MAP = {
  attack: 0,
  damage: 1,
  healing: 2,
  abilityCheck: 3,
  skillCheck: 4,
  savingThrow: 5,
  toolCheck: 6,
  generic: 7
};

export default function prepareRolls(message) {
  const { rolls } = message;
  const messageData = message.flags?.a5e ?? {};

  if (messageData.rollData) {
    return zip(rolls, messageData.rollData).sort(
      (a, b) => ROLL_SORT_KEY_MAP[a[1]?.type] - ROLL_SORT_KEY_MAP[b[1]?.type]
    );
  }

  if (rolls?.length) {
    return [[rolls[0], prepareCheckRollData(messageData)]];
  }

  return [];
}
