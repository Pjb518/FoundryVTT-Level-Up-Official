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

  // Needs to be done to update indexed fields
  await pack?.getIndex({
    // @ts-expect-error
    fields: FIELD_MAPPINGS[type],
  });

  // todo: TEST

  const fields = FIELD_MAPPINGS[type];
  const cls = pack.documentClass;

  // Maybe reuse the existing index if we have already indexed all fields
  const indexFields = new Set([...pack.indexFields, ...fields]);

  // Request the new index from the server
  const index = await cls.database.get(
    cls,
    {
      query: { system: { source: "adventurersGuide" } },
      index: true,
      indexFields: Array.from(indexFields),
      pack: pack.collection,
    },
    game.user,
  );

  const newIndexIds = new Set<number>();

  // Assign the index to the collection
  const restoreArt = pack.documentName === "Actor";
  for (const i of index) {
    const x = pack.index.get(i._id);
    const indexed = x ? foundry.utils.mergeObject(x, i) : i;
    indexed.uuid = pack.getUuid(indexed._id);
    // Restore compendium art if previously assigned
    if (restoreArt) {
      const img = game.compendiumArt.get(indexed.uuid)?.actor ?? indexed.img;
      indexed.img = img;
    }
    pack.index.set(i._id, indexed);
    newIndexIds.add(i._id);
  }

  if (pack.index.size !== newIndexIds.size) {
    // Remove any old entries that were not in the new index
    for (const id of pack.index.keys()) {
      if (!newIndexIds.has(id)) {
        pack.index.delete(id);
      }
    }
  }

  // Record that the pack has been indexed
  console.log(
    `${CONST.vtt} | Constructed index of ${pack.collection} Compendium containing ${pack.index.size} entries`,
  );
  // this.#indexedFields = indexFields;
  return pack.index;
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
