export default function prepareTraitGrantConfigObject() {
  return {
    armorTypes: {
      label: 'A5E.ArmorType',
      config: Object.entries(CONFIG.A5E.armor),
      propertyKey: 'system.proficiencies.armor'
    },
    conditionImmunities: {
      label: 'A5E.ConditionImmunities',
      config: Object.entries(CONFIG.A5E.conditions),
      propertyKey: 'system.traits.conditionImmunities'
    },
    creatureTypes: {
      label: 'A5E.CreatureTypesLabel',
      config: Object.entries(CONFIG.A5E.creatureTypes),
      propertyKey: 'system.details.creatureTypes'
    },
    damageImmunities: {
      label: 'A5E.DamageImmunities',
      config: Object.entries(CONFIG.A5E.damageTypes),
      propertyKey: 'system.traits.damageImmunities'
    },
    damageResistances: {
      label: 'A5E.DamageResistances',
      config: Object.entries(CONFIG.A5E.damageTypes),
      propertyKey: 'system.traits.damageResistances'
    },
    damageVulnerabilities: {
      label: 'A5E.DamageVulnerabilities',
      config: Object.entries(CONFIG.A5E.damageTypes),
      propertyKey: 'system.traits.damageVulnerabilities'
    },
    languages: {
      label: 'A5E.Languages',
      config: Object.entries(CONFIG.A5E.languages),
      propertyKey: 'system.proficiencies.languages'
    },
    maneuverTraditions: {
      label: 'A5E.ManeuverTraditionPlural',
      config: Object.entries(CONFIG.A5E.maneuverTraditions),
      propertyKey: 'system.proficiencies.traditions'
    },
    size: {
      label: 'A5E.Size',
      config: Object.entries(CONFIG.A5E.actorSizes),
      propertyKey: 'system.traits.size'
    },
    tools: {
      label: 'A5E.ToolPlural',
      config: CONFIG.A5E.tools,
      propertyKey: 'system.proficiencies.tools'
    },
    weapons: {
      label: 'A5E.Weapons',
      config: CONFIG.A5E.weapons,
      propertyKey: 'system.proficiencies.weapons'
    }
  };
}
