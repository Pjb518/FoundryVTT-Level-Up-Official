import getCheckTitle from './getCheckTitle';
import getCheckTitleAnnotation from './getCheckTitleAnnotation';

export default function prepareCheckRollData(messageData) {
  return {
    label: getCheckTitle(messageData),
    secondaryLabel: getCheckTitleAnnotation(messageData),
    rollMode: messageData.rollMode,
    type: messageData.cardType
  };
}
