import { A5E } from "../../../../config.ts";

const PRODUCTS = Object.entries(A5E.products).reduce((acc, [k, v]) => {
  acc[k] = v.title;
  return acc;
}, {});

function getFeatureFilterConfig() {
  return [
    {
      filterKey: "featureType",
      heading: "Feature Type",
      options: CONFIG.A5E.featureTypes,
    },
    {
      filterKey: "classes",
      heading: "Class",
      options: CONFIG.A5E.classes,
    },
    {
      filterKey: "source",
      heading: "Source",
      options: PRODUCTS,
    },
  ];
}

function getManeuverFilterConfig() {
  return [
    {
      filterKey: "maneuverDegrees",
      heading: "Maneuver Degrees",
      options: CONFIG.A5E.maneuverDegrees,
    },
    {
      filterKey: "maneuverTraditions",
      heading: "Maneuver Traditions",
      options: CONFIG.A5E.maneuverTraditions,
    },
    {
      filterKey: "miscellaneous",
      heading: "Miscellaneous",
      options: {
        concentration: "Concentration",
        stance: "Stance",
      },
    },
    {
      filterKey: "source",
      heading: "Source",
      options: PRODUCTS,
    },
  ];
}

function getMonsterFilterConfig() {
  return [
    {
      filterKey: "creatureTypes",
      heading: "Creature Types",
      options: CONFIG.A5E.creatureTypes,
    },
    {
      filterKey: "terrain",
      heading: "Terrain",
      options: CONFIG.A5E.terrainTypes,
    },
    {
      filterKey: "creatureSize",
      heading: "Creature Size",
      options: CONFIG.A5E.actorSizes,
    },
    {
      filterKey: "miscellaneous",
      heading: "Miscellaneous",
      options: {
        elite: "Elite",
        swarm: "Swarm",
      },
    },
    {
      filterKey: "source",
      heading: "Source",
      options: PRODUCTS,
    },
  ];
}

function getObjectFilterConfig() {
  return [
    {
      filterKey: "objectType",
      heading: "Object Type",
      options: CONFIG.A5E.objectTypes,
    },
    {
      filterKey: "rarity",
      heading: "Item Rarity",
      options: CONFIG.A5E.itemRarity,
    },
    {
      filterKey: "miscellaneous",
      heading: "Miscellaneous",
      options: {
        bulky: "Bulky",
        requiresAttunement: "Requires Attunement",
      },
    },
    {
      filterKey: "source",
      heading: "Source",
      options: PRODUCTS,
    },
  ];
}

function getSpellFilterConfig() {
  return [
    {
      filterKey: "spellLists",
      heading: "Spell Lists",
      options: CONFIG.A5E.classSpellLists,
    },
    {
      filterKey: "spellLevels",
      heading: "Spell Levels",
      options: CONFIG.A5E.spellLevels,
    },
    {
      filterKey: "primarySpellSchools",
      heading: "Primary Spell Schools",
      options: CONFIG.A5E.spellSchools.primary,
    },
    {
      filterKey: "secondarySpellSchools",
      heading: "Secondary Spell Schools",
      options: CONFIG.A5E.spellSchools.secondary,
    },
    {
      filterKey: "components",
      heading: "Components",
      options: CONFIG.A5E.spellComponents,
    },
    {
      filterKey: "miscellaneous",
      heading: "Miscellaneous",
      options: {
        concentration: "Concentration",
        rare: "Rare",
        ritual: "Ritual",
      },
    },
    {
      filterKey: "source",
      heading: "Source",
      options: PRODUCTS,
    },
  ];
}

export function getFilterConfig(documentType: string) {
  if (documentType === "feature") return getFeatureFilterConfig();
  if (documentType === "maneuver") return getManeuverFilterConfig();
  if (documentType === "npc") return getMonsterFilterConfig();
  if (documentType === "object") return getObjectFilterConfig();
  if (documentType === "spells") return getSpellFilterConfig();
  return [];
}
