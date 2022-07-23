import dynamicBooleanFilter from './dynamicBooleanFilter';
import simpleFilter from './simpleFilter';

export default function filterObjects(actor, items) {
  let filteredItems = items;

  filteredItems = simpleFilter(actor, filteredItems, 'system.activation.type', 'spellActivationCostFilters');
  filteredItems = simpleFilter(actor, filteredItems, 'system.schools.primary', 'spellSchoolFilters');

  filteredItems = dynamicBooleanFilter(actor, filteredItems, 'system.components', 'spellComponentFilters');
  filteredItems = dynamicBooleanFilter(actor, filteredItems, 'system', 'miscellaneousSpellFilters');

  return filteredItems;
}
