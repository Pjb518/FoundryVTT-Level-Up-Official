const spellsFilterConfig = {
  spellLists: {
    key: 'system.classes',
    type: 'array'
  },
  spellLevels: {
    key: 'system.level',
    type: 'value'
  },
  primarySpellSchools: {
    key: 'system.schools.primary',
    type: 'value'
  },
  secondarySpellSchools: {
    key: 'system.schools.secondary',
    type: 'array'
  },
  miscellaneous: {
    subFilters: {
      concentration: {
        key: 'system.concentration',
        type: 'boolean'
      },
      ritual: {
        key: 'system.ritual',
        type: 'boolean'
      },
      rare: {
        key: 'system.rare',
        type: 'boolean'
      }
    }
  }
};

const maneuverFilterConfig = {
  exertion: {
    key: 'system.exertionCost',
    type: 'range'
  },
  maneuverDegrees: {
    key: 'system.degree',
    type: 'value'
  },
  maneuverTraditions: {
    key: 'system.tradition',
    type: 'value'
  },
  miscellaneous: {
    subFilters: {
      stance: {
        key: 'system.isStance',
        type: 'boolean'
      }
    }
  }
};

const monstersFilterConfig = {
  cr: {
    key: 'system.details.cr',
    type: 'range'
  },
  creatureSize: {
    key: 'system.traits.size',
    type: 'value'
  },
  creatureTypes: {
    key: 'system.details.creatureTypes',
    type: 'array'
  },
  miscellaneous: {
    subFilters: {
      elite: {
        key: 'system.details.elite',
        type: 'boolean'
      },
      swarm: {
        key: 'system.details.isSwarm',
        type: 'boolean'
      }
    }
  }
};

const objectFilterConfig = {
  objectType: {
    key: 'system.objectType',
    type: 'value'
  },
  rarity: {
    key: 'system.rarity',
    type: 'value'
  },
  miscellaneous: {
    subFilters: {
      bulky: {
        key: 'system.bulky',
        type: 'boolean'
      },
      requiresAttunement: {
        key: 'system.requiresAttunement',
        type: 'boolean'
      }
    }
  }
};

const typeMap = {
  spells: spellsFilterConfig,
  magicItem: objectFilterConfig,
  maneuvers: maneuverFilterConfig,
  monsters: monstersFilterConfig,
  object: objectFilterConfig
};

function arrayFilter(key, value, mode) {
  if (mode) {
    return (doc) => foundry.utils.getProperty(doc, key)?.includes(value);
  }

  return (doc) => !foundry.utils.getProperty(doc, key)?.includes(value);
}

function booleanFilter(key, mode) {
  if (mode) {
    return (doc) => foundry.utils.getProperty(doc, key);
  }

  return (doc) => !foundry.utils.getProperty(doc, key);
}

function rangeFilter(key, { min, max }) {
  return (doc) => {
    const value = foundry.utils.getProperty(doc, key);
    return value >= min && value <= max;
  };
}

function valueFilter(key, value, mode) {
  if (mode) {
    // Intentionally using == instead of ===
    return (doc) => foundry.utils.getProperty(doc, key) == value;
  }

  // Intentionally using == instead of ===
  return (doc) => foundry.utils.getProperty(doc, key) != value;
}

export default function constructReducerFilters(reducer, filtersSelections, type) {
  const prevFilters = [...reducer.filters].filter((f) => f.id !== 'searchFilter');
  reducer.filters.remove(...prevFilters);

  const filterConfig = typeMap[type];
  const filterCount = { and: 0, or: 0 };

  for (const [filterKey, filterData] of Object.entries(filtersSelections)) {
    const andFilters = [];
    const orFilters = [];

    const { key, type, subFilters } = filterConfig?.[filterKey] ?? {};
    if ((!key || !type) && !subFilters) continue;

    if (type === 'range') {
      const { min, max } = filterData;
      const filter = rangeFilter(key, { min, max });

      andFilters.push({ filter });
      filterCount.and += 1;
    } else {
      const {
        inclusive, inclusiveMode, exclusive, exclusiveMode
      } = filterData;
      // Start with the inclusive filters
      inclusive.forEach((value) => {
        let filter;

        if (type === 'array') filter = arrayFilter(key, value, true);
        else if (subFilters?.[value]?.type === 'boolean') {
          filter = booleanFilter(subFilters[value].key, true);
        } else if (type === 'boolean') filter = booleanFilter(key, true);
        else if (type === 'value') filter = valueFilter(key, value, true);
        else return;

        if (inclusiveMode) andFilters.push({ filter });
        else orFilters.push(filter);
      });

      // Then do the exclusive filters
      exclusive.forEach((value) => {
        let filter;

        if (type === 'array') filter = arrayFilter(key, value, false);
        else if (subFilters?.[value]?.type === 'boolean') {
          filter = booleanFilter(subFilters[value].key, false);
        } else if (type === 'boolean') filter = booleanFilter(key, false);
        else if (type === 'value') filter = valueFilter(key, value, false);
        else return;

        if (exclusiveMode) andFilters.push({ filter });
        else orFilters.push(filter);
      });
    }

    if (andFilters.length) {
      reducer.filters.add(...andFilters);
      filterCount.and += andFilters.length;
    }

    if (orFilters.length) {
      reducer.filters.add({
        filter: (doc) => orFilters.some((filterFn) => filterFn(doc))
      });

      filterCount.or += 1;
    }
  }

  return filterCount;
}
