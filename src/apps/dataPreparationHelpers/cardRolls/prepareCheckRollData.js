import getCheckTitle from './getCheckTitle';

export default function prepareCheckRollData(messageData) {
  return {
    label: getCheckTitle(messageData),
    expertiseDice: messageData.expertiseDice,
    rollMode: messageData.rollMode,
    type: messageData.cardType
  };
}
