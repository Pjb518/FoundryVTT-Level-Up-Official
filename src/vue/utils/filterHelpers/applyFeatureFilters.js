import simpleFilter from './simpleFilter';

export default function filterObjects(actor, items) {
  let filteredItems = Array.from(items);

  filteredItems = simpleFilter(actor, filteredItems, 'data.activation.type', 'featureActivationCostFilters');
  filteredItems = simpleFilter(actor, filteredItems, 'data.featureType', 'featureTypeFilters');

  return filteredItems;
}
