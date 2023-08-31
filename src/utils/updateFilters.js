/**
 *
 * @param {String} key
 * @param {('inclusive'|'exclusive')} type
 * @returns
 */
function booleanFilter(key, type = 'inclusive') {
  if (type === 'exclusive') {
    return (item) => !foundry.utils.getProperty(item, key);
  }

  return (item) => foundry.utils.getProperty(item, key);
}

/**
 *
 * @param {String} key
 * @param {String | Number} value
 * @param {('inclusive'|'exclusive')} type
 * @returns
 */
function valueBasedFilter(key, value, type = 'inclusive') {
  if (type === 'exclusive') {
    return (item) => foundry.utils.getProperty(item, key) !== value;
  }

  return (item) => foundry.utils.getProperty(item, key) === value;
}

function actionBasedFilter(key, value, type = 'inclusive') {
  const filter = (item) => {
    const actionKeys = item.actions.activationTypes;

    if (type === 'exclusive') {
      return actionKeys.some((actionValue) => value !== actionValue);
    }

    return actionKeys.some((actionValue) => value === actionValue);
  };

  return filter;
}

export default function updateFilters(reducer, type, filterKeys) {
  // Clear existing filters
  const removeIds = [...reducer.filters].reduce((acc, filter) => {
    if (filter?.id?.includes(`${type}-`)) acc.push(filter.id);

    return acc;
  }, []);

  reducer.filters.removeById(...removeIds);

  // Get filterData
  const filterData = Object.values(CONFIG.A5E.filters[type])
    .reduce((acc, curr) => ({ ...acc, ...curr.filters }), {});

  const andFilters = [];
  const orFilters = [];

  // Get inclusive filters
  filterKeys?.inclusive?.forEach((value) => {
    const { key, type: filterType, truthValue } = filterData[value];
    let filter;

    if (filterType === 'boolean') filter = booleanFilter(key);
    else if (filterType === 'value') filter = valueBasedFilter(key, value);
    else if (filterType === 'action') filter = actionBasedFilter(key, value);
    else return;

    if (truthValue === 'or') {
      orFilters.push(filter);
    } else {
      andFilters.push({
        id: `${type}-${value}`,
        filter
      });
    }
  });

  // Get exclusive filters
  filterKeys?.exclusive?.forEach((value) => {
    const { key, type: filterType } = filterData[value];
    let filter;

    if (filterType === 'boolean') filter = booleanFilter(key, 'exclusive');
    else if (filterType === 'value') filter = valueBasedFilter(key, value, 'exclusive');
    else if (filterType === 'action') filter = actionBasedFilter(key, value, 'exclusive');
    else return;

    andFilters.push({
      id: `${type}-${value}`,
      filter
    });
  });

  // Add and filters to reducer
  reducer.filters.add(...andFilters);

  // Add or filters to reducer
  if (!orFilters.length) return;
  reducer.filters.add({
    id: `${type}-or`,
    filter: (item) => orFilters.some((filterFn) => filterFn(item))
  });
}
