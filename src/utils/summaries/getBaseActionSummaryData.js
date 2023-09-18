import getActivationCostLabel from './getActivationCostLabel';
import getAreaLabel from './getAreaLabel';
import getDurationLabel from './getDurationLabel';
import getRangeLabels from './getRangeLabels';
import getTargetLabel from './getTargetLabel';

export default function getBaseActionSummaryData(item, action) {
  return {
    activationCost: getActivationCostLabel(item, action),
    area: getAreaLabel(action),
    duration: getDurationLabel(item, action),
    ranges: getRangeLabels(action),
    targets: getTargetLabel(action)
  };
}
