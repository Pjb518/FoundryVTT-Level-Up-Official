const itemMappings = {
  feature: createFeature,
  manuever: createManuever,
  object: createObject,
  spell: createSpell
};

export default async function createItem(actor, itemType, subType) {
  const updateData = {
    name: `New ${itemType}`,
    type: itemType,
    system: itemMappings[itemType](subType)
  };

  await actor.createEmbeddedDocuments('Item', [updateData]);
}

function createFeature(type) { }

function createManuever(type) { }

function createObject(type) {
  // Add type data
  const system = {
    objectType: type
  };

  return system;
}

function createSpell(type) { }
