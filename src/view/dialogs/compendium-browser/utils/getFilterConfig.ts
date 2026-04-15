import { A5E } from "../../../../config.ts";

const PRODUCTS = Object.entries(A5E.products).reduce((acc, [k, v]) => {
  acc[k] = v.title;
  return acc;
}, {});

function getGenericConfig() {
  return [
    {
      filterKey: "source",
      heading: "Source",
      options: PRODUCTS,
    },
  ];
}

function getArchetypeFilterConfig() {
  return [
    {
      filterKey: "class",
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

  function getFeatureFilterConfig(filterSelections?: Record<string, any>) {
    const featSelected =
      filterSelections?.featureType?.inclusive?.includes("feat") ?? false;

    const newAbilityList = {
        none: "A5E.None",
        ...CONFIG.A5E.abilities,
        spellcasting: "A5E.abilities.spellcasting",
    };

    const config: any[] = [
      {
        filterKey: "featureType",
        heading: "Feature Type",
        options: CONFIG.A5E.featureTypes,
      },
    ];

    if (featSelected && CONFIG.A5E.synergies && Object.keys(CONFIG.A5E.synergies).length > 0) {
      config.push(
        {
          filterKey: "asi",
          heading: "ASI",
          options: newAbilityList,
        },
        {
          filterKey: "featClasses",
          heading: "A5E Class Prerequisites",
          options: CONFIG.A5E.classes,
        },
        {
          filterKey: "featType",
          heading: "Feat Type",
          options: CONFIG.A5E.featTypes,
        },
        {
          filterKey: "synergy",
          heading: "Synergy Chain",
          options: CONFIG.A5E.synergies,
        },
      );
    }

    config.push(
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
    );

  return config;
}

function getInteractionFilterConfig() {
  return [
    {
      filterKey: "interactionType",
      heading: "Interaction Type",
      options: CONFIG.A5E.interactionTypes,
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
      filterKey: "exertion",
      heading: "Exertion Cost Range",
      options: {
        min: 0,
        max: 6,
      },
      type: "range",
    },
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
      filterKey: "cr",
      heading: "CR Range",
      options: {
        min: 0,
        max: 30,
      },
      type: "range",
    },
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

export function getFilterConfig(documentType: string, filterSelections?: Record<string, any>) {
  if (documentType === "archetype") return getArchetypeFilterConfig();
  if (documentType === "feature") return getFeatureFilterConfig(filterSelections);
  if (documentType === "interaction") return getInteractionFilterConfig();
  if (documentType === "maneuver") return getManeuverFilterConfig();
  if (documentType === "npc") return getMonsterFilterConfig();
  if (documentType === "object") return getObjectFilterConfig();
  if (documentType === "spell") return getSpellFilterConfig();
  return getGenericConfig();
}
