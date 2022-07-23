import dynamicBooleanFilter from './dynamicBooleanFilter';
import simpleFilter from './simpleFilter';

export default function filterObjects(actor, items) {
  let filteredItems = items;

  filteredItems = simpleFilter(actor, filteredItems, 'system.activation.type', 'itemActivationCostFilters');
  filteredItems = simpleFilter(actor, filteredItems, 'system.objectType', 'objectTypeFilters');
  filteredItems = simpleFilter(actor, filteredItems, 'system.rarity', 'itemRarityFilters');

  filteredItems = dynamicBooleanFilter(actor, filteredItems, 'system', 'miscellaneousItemFilters');

  return filteredItems;
}
