const itemMappings = {
  feature: createFeature,
  maneuver: createManuever,
  object: createObject,
  spell: createSpell
};

export default async function createItem(actor, itemType, subType) {
  const updateData = {
    name: `New ${subType.capitalize()}`,
    type: itemType,
    system: itemMappings[itemType](subType)
  };

  const documents = await actor.createEmbeddedDocuments('Item', [updateData]);
  documents.forEach((d) => d?.sheet?.render(true));
}

function createFeature(type) {
  return {
    featureType: type
  };
}

function createManuever(type) {
  const system = {
    degree: Number(type)
  };

  // Add Exertion Consumer
  const actions = {
    [foundry.utils.randomID()]: {
      name: 'Execute',
      consumers: {
        [foundry.utils.randomID()]: {
          resource: 'exertion',
          quantity: 1,
          type: 'resource'
        }
      }
    }
  };

  system.actions = actions;
  return system;
}

function createObject(type) {
  return {
    objectType: type
  };
}

function createSpell(type) {
  const system = {
    level: Number(type)
  };

  if (system.level === 0) return system;

  // Add Spell Consumer
  const actions = {
    [foundry.utils.randomID()]: {
      name: 'Cast Spell',
      consumers: {
        [foundry.utils.randomID()]: {
          mode: 'variable',
          spellLevel: Number(type),
          points: CONFIG.A5E.spellLevelCost[Number(type)],
          type: 'spell'
        }
      }
    }
  };

  system.actions = actions;
  return system;
}
