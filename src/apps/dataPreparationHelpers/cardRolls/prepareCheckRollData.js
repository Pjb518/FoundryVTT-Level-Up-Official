import getCheckTitle from './getCheckTitle';

export default function prepareCheckRollData(messageData) {
  return {
    label: getCheckTitle(messageData),
    rollMode: messageData.rollMode,
    type: messageData.cardType
  };
}
