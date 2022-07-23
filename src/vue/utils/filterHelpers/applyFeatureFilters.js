import simpleFilter from './simpleFilter';

export default function filterObjects(actor, items) {
  let filteredItems = Array.from(items);

  filteredItems = simpleFilter(actor, filteredItems, 'system.activation.type', 'featureActivationCostFilters');
  filteredItems = simpleFilter(actor, filteredItems, 'system.featureType', 'featureTypeFilters');

  return filteredItems;
}
