import dynamicBooleanFilter from './dynamicBooleanFilter';
import simpleFilter from './simpleFilter';

export default function filterObjects(actor, items) {
  let filteredItems = items;

  filteredItems = simpleFilter(actor, filteredItems, 'data.activation.type', 'spellActivationCostFilters');
  filteredItems = simpleFilter(actor, filteredItems, 'data.schools.primary', 'spellSchoolFilters');

  filteredItems = dynamicBooleanFilter(actor, filteredItems, 'data.components', 'spellComponentFilters');
  filteredItems = dynamicBooleanFilter(actor, filteredItems, 'data', 'miscellaneousSpellFilters');

  return filteredItems;
}
