/* eslint-disable eqeqeq */
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
  components: {
    subFilters: {
      material: {
        key: 'system.components.material',
        type: 'boolean'
      },
      seen: {
        key: 'system.components.seen',
        type: 'boolean'
      },
      vocalized: {
        key: 'system.components.vocalized',
        type: 'boolean'
      }
    }
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
  },
  source: {
    key: 'system.source',
    type: 'value'
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
      concentration: {
        key: 'system.concentration',
        type: 'boolean'
      },
      stance: {
        key: 'system.isStance',
        type: 'boolean'
      }
    }
  },
  source: {
    key: 'system.source',
    type: 'value'
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
  },
  terrain: {
    key: 'system.details.terrain',
    type: 'array'
  },
  source: {
    key: 'system.source',
    type: 'value'
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
  },
  source: {
    key: 'system.source',
    type: 'value'
  }
};

const classFeatureConfig = {
  classes: {
    key: 'system.classes',
    type: 'value'
  },
  source: 'system.source',
  type: 'value'
};

const archetypeFilterConfig = {
  class: {
    key: 'system.class',
    type: 'value'
  },
  source: {
    key: 'system.source',
    type: 'value'
  }
};

const typeMap = {
  '5eSpell': spellsFilterConfig,
  classFeature: classFeatureConfig,
  object: objectFilterConfig,
  magicItem: objectFilterConfig,
  maneuver: maneuverFilterConfig,
  monster: monstersFilterConfig,
  spell: spellsFilterConfig,

  archetype: archetypeFilterConfig
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

export default function constructReducerFilters(reducer, filtersSelections, compendiumType) {
  const prevFilters = [...reducer.filters].filter((f) => f.id !== 'searchFilter');
  reducer.filters.remove(...prevFilters);

  const filterConfig = typeMap[compendiumType];
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
