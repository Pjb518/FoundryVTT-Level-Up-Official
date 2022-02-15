import simpleFilter from './simpleFilter';

export default function filterObjects(actor, items) {
  let filteredItems = Array.from(items);
  const degreeFilters = actor.getFlag('a5e', 'maneuverDegreeFilters');

  filteredItems = simpleFilter(actor, filteredItems, 'data.activation.type', 'maneuverActivationCostFilters');
  filteredItems = simpleFilter(actor, filteredItems, 'data.tradition', 'maneuverTraditionFilters');

  if (degreeFilters?.inclusive?.length) {
    filteredItems = filteredItems.filter(
      (item) => degreeFilters.inclusive.includes(item.data.degree.toString())
    );
  }

  if (degreeFilters?.exclusive?.length) {
    filteredItems = filteredItems.filter(
      (item) => !degreeFilters.exclusive.includes(item.data.degree.toString())
    );
  }

  return filteredItems;
}
