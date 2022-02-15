import dynamicBooleanFilter from './dynamicBooleanFilter';
import simpleFilter from './simpleFilter';

export default function filterObjects(actor, items) {
  let filteredItems = items;

  filteredItems = simpleFilter(actor, filteredItems, 'data.activation.type', 'itemActivationCostFilters');
  filteredItems = simpleFilter(actor, filteredItems, 'data.objectType', 'objectTypeFilters');
  filteredItems = simpleFilter(actor, filteredItems, 'data.rarity', 'itemRarityFilters');

  filteredItems = dynamicBooleanFilter(actor, filteredItems, 'data', 'miscellaneousItemFilters');

  return filteredItems;
}
