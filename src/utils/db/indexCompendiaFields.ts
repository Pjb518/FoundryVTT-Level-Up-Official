const FIELD_MAPPINGS = {
  archetype: ["system.description", "system.class", "system.source"],
  feature: [
    "system.description",
    "system.classes",
    "system.concentration",
    "system.featureType",
    "system.prerequisite",
    "system.source",
  ],
  manuever: [
    "system.description",
    "system.exertionCost",
    "system.concentration",
    "system.degree",
    "system.isStance",
    "system.source",
    "system.tradition",
  ],
  npc: [
    "system.description",
    "system.details.cr",
    "system.details.creatureTypes",
    "system.details.elite",
    "system.details.isSquad",
    "system.details.isSwarm",
    "system.details.terrain",
    "system.traits.size",
    "system.source",
  ],
  spell: [
    "system.concentration",
    "system.components",
    "system.classes",
    "system.description",
    "system.level",
    "system.rare",
    "system.ritual",
    "system.schools",
    "system.source",
  ],
  object: [
    "system.requiresAttunement",
    "system.bulky",
    "system.objectType",
    "system.price",
    "system.quantity",
    "system.rarity",
    "system.source",
  ],
} as const;

async function updateIndex(packId: string, type: keyof typeof FIELD_MAPPINGS) {
  const pack = game.packs.get(packId);
  await pack?.getIndex({
    // @ts-expect-error
    fields: FIELD_MAPPINGS[type],
  });
}

export async function indexCompendiaFields() {
  // await Promise.all(
  console.log("here");
  game.packs.map((pack) => {
    const id = pack.metadata.id || pack.collection;
    if (!id) return;

    const documentType = pack.metadata.type;
    if (!documentType) return;

    const indexTypes: string[] = [...pack.index]
      .map((idx) => idx.type)
      .filter(Boolean);

    if (!indexTypes.every((type: string) => indexTypes[0] === type)) return;

    const indexType = indexTypes[0];
    if (FIELD_MAPPINGS[indexType]) {
      // @ts-expect-error
      updateIndex(id, indexType);
    }
  });
  // );
}
