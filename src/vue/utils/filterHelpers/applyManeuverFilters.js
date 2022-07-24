import simpleFilter from './simpleFilter';

export default function filterObjects(actor, items) {
  let filteredItems = Array.from(items);
  const degreeFilters = actor.getFlag('a5e', 'maneuverDegreeFilters');

  filteredItems = simpleFilter(actor, filteredItems, 'system.activation.type', 'maneuverActivationCostFilters');
  filteredItems = simpleFilter(actor, filteredItems, 'system.tradition', 'maneuverTraditionFilters');

  if (degreeFilters?.inclusive?.length) {
    filteredItems = filteredItems.filter(
      (item) => degreeFilters.inclusive.includes(item.system.degree.toString())
    );
  }

  if (degreeFilters?.exclusive?.length) {
    filteredItems = filteredItems.filter(
      (item) => !degreeFilters.exclusive.includes(item.system.degree.toString())
    );
  }

  return filteredItems;
}
