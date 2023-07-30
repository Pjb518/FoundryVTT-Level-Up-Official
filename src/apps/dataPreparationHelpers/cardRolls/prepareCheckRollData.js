import getCheckTitle from './getCheckTitle';
import getCheckTitleAnnotation from './getCheckTitleAnnotation';

export default function prepareCheckRollData(messageData) {
  return {
    label: getCheckTitle(messageData),
    secondaryLabel: getCheckTitleAnnotation(messageData),
    rollMode: messageData?.flags?.a5e?.rollMode,
    type: messageData?.flags?.a5e?.cardType
  };
}
