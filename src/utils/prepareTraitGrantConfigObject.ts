export default function prepareTraitGrantConfigObject() {
  return {
    alignment: {
      label: "A5E.traits.headings.alignment",
      config: Object.entries(CONFIG.A5E.alignments),
      propertyKey: "system.traits.alignment",
    },
    conditionImmunities: {
      label: "A5E.conditions.immunities",
      config: Object.entries(CONFIG.A5E.conditions),
      propertyKey: "system.traits.conditionImmunities",
    },
    creatureTypes: {
      label: "A5E.details.creature.labels.types",
      config: Object.entries(CONFIG.A5E.creatureTypes),
      propertyKey: "system.details.creatureTypes",
    },
    damageImmunities: {
      label: "A5E.traits.headings.damage.immunities",
      config: Object.entries(CONFIG.A5E.damageTypes),
      propertyKey: "system.traits.damageImmunities",
    },
    damageResistances: {
      label: "A5E.traits.headings.damage.resistances",
      config: Object.entries(CONFIG.A5E.damageTypes),
      propertyKey: "system.traits.damageResistances",
    },
    damageVulnerabilities: {
      label: "A5E.traits.headings.damage.vulnerabilities",
      config: Object.entries(CONFIG.A5E.damageTypes),
      propertyKey: "system.traits.damageVulnerabilities",
    },
    languages: {
      label: "A5E.details.languages",
      config: Object.entries(CONFIG.A5E.languages),
      propertyKey: "system.proficiencies.languages",
    },
    size: {
      label: "A5E.traits.size.title",
      config: Object.entries(CONFIG.A5E.actorSizes),
      propertyKey: "system.traits.size",
    },
  };
}
