// ---------------------------------------------------
// Filter Data
/**
 * Data for filters on the spells page. Schools of magic are added in on the page.
 */

export default function registerFilterConfig(A5E) {
  const abilityActionFilters = {};
  Object.entries(A5E.abilityActivationTypes).forEach(([value, label]) => {
    abilityActionFilters[value] = { label, key: 'system.activation.type', type: 'action' };
  });

  A5E.filters = {
    features: {
      activationCost: {
        label: 'A5E.FilterLabelActivationCost',
        filters: { ...abilityActionFilters }
      }
    },
    maneuvers: {
      activationCost: {
        label: 'A5E.FilterLabelActivationCost',
        filters: { ...abilityActionFilters }
      },
      traditions: {
        label: 'A5E.FilterLabelManueverTraditions',
        filters: {}
      }
    },
    objects: {
      activationCost: {
        label: 'A5E.FilterLabelActivationCost',
        filters: { ...abilityActionFilters }
      },
      rarity: {
        label: 'A5E.FilterLabelRarity',
        filters: {}
      },
      miscellaneous: {
        label: 'A5E.FilterLabelMiscellaneous',
        filters: {
          attuned: { label: 'A5E.Attuned', key: 'system.attuned', type: 'boolean' },
          bulky: { label: 'A5E.ItemBulky', key: 'system.bulky', type: 'boolean' },
          equipped: { label: 'A5E.ItemEquipped', key: 'system.equipped', type: 'boolean' },
          plotItem: { label: 'A5E.PlotItem', key: 'system.plotItem', type: 'boolean' },
          requiresAttunement: { label: 'A5E.AttunementRequired', key: 'system.requiredAttunement', type: 'boolean' }
        }
      }
    },
    spells: {
      activationCost: {
        label: 'A5E.FilterLabelActivationCost',
        filters: { ...abilityActionFilters }
      },
      components: {
        label: 'A5E.FilterLabelSpellComponents',
        filters: {
          material: {
            label: 'A5E.SpellComponentMaterial',
            key: 'system.components.material',
            type: 'boolean'
          },
          seen: {
            label: 'A5E.SpellComponentSeen',
            key: 'system.components.seen',
            type: 'boolean'
          },
          vocalized: {
            label: 'A5E.SpellComponentVocalized',
            key: 'system.components.vocalized',
            type: 'boolean'
          }
        }
      },
      miscellaneous: {
        label: 'A5E.FilterLabelMiscellaneous',
        filters: {
          concentration: { label: 'A5E.ConditionConcentration', key: 'system.concentration', type: 'boolean' },
          ritual: { label: 'A5E.SpellRitual', key: 'system.ritual', type: 'boolean' },
          prepared: { label: 'A5E.SpellPrepared', key: 'system.prepared', type: 'boolean' }
        }
      },
      primarySpellSchools: {
        label: 'A5E.FilterLabelPrimarySpellSchools',
        filters: {}
      }
    }
  };

  Object.entries(A5E.maneuverTraditions).forEach(([value, label]) => {
    A5E.filters.maneuvers.traditions.filters[value] = {
      label, key: 'system.tradition', type: 'value'
    };
  });

  Object.entries(A5E.itemRarity).forEach(([value, label]) => {
    A5E.filters.objects.rarity.filters[value] = {
      label, key: 'system.rarity', type: 'value'
    };
  });

  Object.entries(A5E.spellSchools.primary).forEach(([value, label]) => {
    A5E.filters.spells.primarySpellSchools.filters[value] = {
      label, key: 'system.schools.primary', type: 'value'
    };
  });
}
