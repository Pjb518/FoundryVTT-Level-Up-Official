import { localize } from "#utils/localization/localize.ts";

import { prepareXP } from "#utils/view/helpers/prepareXP.ts";

export function getDetailsLabel(doc) {
  if (doc.name === "A Better Mousetrap") {
    console.log(doc);
  }

  if (!doc.system) return null;

  const type = doc.type;

  if (type === "archetype") return getArchetypeDetailsLabel(doc);
  if (type === "feature") return getFeatureDetailsLabel(doc);
  if (type === "interaction") return getInteractionDetailsLabel(doc);
  if (type === "maneuver") return getManeuverDetailsLabel(doc);
  if (type === "npc") return getMonsterDetailsLabel(doc);
  if (type === "object") return getObjectDetailsLabel(doc);
  if (type === "spell") return getSpellDetailsLabel(doc);
}

function getArchetypeDetailsLabel(archetype: Item): string {
  const parentClass = CONFIG.A5E.classes[archetype.system.class] ?? "";
  return parentClass;
}

function getFeatureDetailsLabel(feature: Item): string {
  const parentClass = feature.system.classes;

  const featureProperties: string[] = [];
  const featureType =
    CONFIG.A5E.featureTypes?.[feature.system.featureType] ||
    feature.system.featureType;

  featureProperties.push(featureType);

  featureProperties.push(
    CONFIG.A5E.classes[parentClass] ?? CONFIG.A5E.classes5e[parentClass],
  );

  if (feature.system.featureType === "knack") {
    featureProperties.push(CONFIG.A5E.knackTypes[parentClass]);
  }

  return featureProperties.filter(Boolean).join(" | ");
}

function getInteractionDetailsLabel(interaction: Item): string {
  const interactionType =
    CONFIG.A5E.interactionTypes?.[interaction.system.interactionType] ??
    interaction.system.interactionType;

  return interactionType;
}

function getManeuverDetailsLabel(maneuver: Item) {
  const maneuverDegree =
    CONFIG.A5E.maneuverDegrees[parseInt(maneuver.system.degree, 10)];

  const tradition =
    CONFIG.A5E.maneuverTraditions[maneuver.system.tradition] ?? "";
  const stance = maneuver.system.isStance ? "Stance" : "";

  const exertionCost = maneuver.system.exertionCost
    ? `(${maneuver.system.exertionCost} ${localize(
        maneuver.system.exertionCost > 1
          ? "A5E.exertion.pointPlural"
          : "A5E.ExertionPoint",
      )})`
    : "";

  const maneuverProperties = [maneuverDegree, tradition, stance, exertionCost]
    .filter(Boolean)
    .join(" ");

  return maneuverProperties;
}

function getMonsterDetailsLabel(monster) {
  const components = [];

  const cr = (() => {
    const cr = monster?.system?.details?.cr;

    if (cr === undefined) return "?";
    if (cr === 0.125 || cr === "0.125") return "⅛";
    if (cr === 0.25 || cr === "0.25") return "¼";
    if (cr === 0.5 || cr === "0.5") return "½";

    return cr;
  })();

  const creatureTypes = (() => {
    return (monster?.system?.details?.creatureTypes ?? [])
      .map((creatureType: string) => {
        return CONFIG.A5E.creatureTypes[creatureType] ?? creatureType ?? "";
      })
      .sort((a, b) => a.localeCompare(b))
      .join(", ");
  })();

  const isElite = monster?.system?.details?.elite;
  const sizeCategory =
    CONFIG.A5E.actorSizes[monster?.system?.traits?.size] ?? "";
  const xp = prepareXP(monster);

  if (cr === "?") {
    components.push(sizeCategory, creatureTypes);
  } else {
    components.push(
      sizeCategory,
      creatureTypes,
      "|",
      isElite ? "Elite" : "",
      `CR ${cr}`,
      `(${xp} XP)`,
    );
  }

  return components
    .filter(
      (component) => !foundry.utils.isEmpty(component) && component !== "",
    )
    .join(" ");
}

function getObjectDetailsLabel(object: Item): string {
  const attunement = object.system.requiresAttunement
    ? "Requires Attunement"
    : "";

  const { price } = object.system;
  const rarity = (() => {
    const itemRarity = CONFIG.A5E.itemRarity;
    if (!object.system.rarity || object.system.rarity === "mundane")
      return null;
    return itemRarity[object.system.rarity] ?? object.system.rarity;
  })();

  if (rarity) {
    if (price && attunement) return `${rarity} (${attunement}; Cost ${price})`;
    if (price) return `${rarity} (Cost ${price})`;
    if (attunement) return `${rarity} (${attunement})`;

    return rarity;
  }

  if (price && attunement) return `${attunement}; Cost ${price}`;
  if (price) return `Cost ${price}`;
  if (attunement) return attunement;

  return "";
}

function getSpellDetailsLabel(spell) {
  const { level, schools } = spell.system;
  const spellLevel = CONFIG.A5E.spellLevels[level] ?? "";

  const primarySchool =
    CONFIG.A5E.spellSchools.primary[schools.primary] ?? schools.primary;

  const secondarySchools = schools.secondary.map(
    (school) => CONFIG.A5E.spellSchools.secondary[school] ?? school,
  );

  secondarySchools.sort((a, b) => a.localeCompare(b));

  const spellSchoolsLabel = [primarySchool, ...secondarySchools].join(", ");

  if (spellSchoolsLabel) return `${spellLevel} (${spellSchoolsLabel})`;
  return spellLevel;
}
