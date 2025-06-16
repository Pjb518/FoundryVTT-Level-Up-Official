import { getCheckTitle } from "./getCheckTitle.ts";

export function prepareCheckRollData(messageData) {
  return {
    label: getCheckTitle(messageData),
    expertiseDice: messageData.expertiseDice,
    rollMode: messageData.rollMode,
    type: messageData.cardType,
  };
}
