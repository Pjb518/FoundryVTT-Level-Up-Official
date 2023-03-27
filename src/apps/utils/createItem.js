const itemMappings = {
  feature: createFeature,
  manuever: createManuever,
  object: createObject,
  spell: createSpell
};

export default async function createItem(actor, itemType, subType) {
  const updateData = {
    name: `New ${subType.capitalize()}`,
    type: itemType,
    system: itemMappings[itemType](subType)
  };

  await actor.createEmbeddedDocuments('Item', [updateData]);
}

function createFeature(type) {
  return {
    featureType: type
  };
}

function createManuever(type) { }

function createObject(type) {
  return {
    objectType: type
  };
}

function createSpell(type) { }
