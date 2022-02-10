import simpleFilter from './simpleFilter';

export default function filterObjects(actor, items) {
  return simpleFilter(actor, items, 'data.activation.type', 'featureActivationCostFilters');
}
