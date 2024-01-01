import * as indexFunctions from '../utils/createIndexes';

const fancyPackData = {
  manuevers: {
    packs: ['a5e.a5e-maneuvers'],
    func: indexFunctions.createManeuverLikeIndex
  },
  monsters: {
    packs: ['a5e.a5e-monsters'],
    func: indexFunctions.createMonsterLikeIndex
  },
  spells: {
    packs: ['a5e.a5e-spells'],
    func: indexFunctions.createSpellLikeIndex
  },
  dnd5eMonsters: {
    packs: ['a5e.dnd5e-monsters'],
    func: indexFunctions.create5eMonsterLikeIndex
  },
  dnd5eSpells: {
    packs: ['a5e.dnd5e-spells'],
    func: indexFunctions.create5eSpellLikeIndex
  },
  objects: {
    packs: ['a5e.a5e-adventuring-gear', 'a5e.dnd5e-items'],
    func: indexFunctions.createObjectLikeIndex
  }
};

const autoMappingConfig = {
  npc: indexFunctions.createMonsterLikeIndex,
  spell: indexFunctions.createSpellLikeIndex,
  object: indexFunctions.createObjectLikeIndex
};

export default function setupFancySheets() {
  const definedPacks = new Set();

  // Setup defined packs
  Object.values(fancyPackData).forEach(({ packs, func }) => {
    packs.forEach((pack) => {
      func(pack);
      definedPacks.add(pack);
    });
  });

  // Setup undefined packs
  if (!game.settings.storage.get('world').getItem('a5e.autoApplyFancySheets')) return;

  for (const pack of game.packs) {
    const id = pack.metadata.id || pack.collection;

    if (!id) continue;
    // if (definedPacks.has(id)) continue;

    const documentType = pack.metadata.type;
    if (!documentType) continue;

    const indexTypes: string[] = [...pack.index].map((index) => index.type).filter(Boolean);
    if (!indexTypes.every((type: string) => indexTypes[0] === type)) continue;

    const indexType = indexTypes[0];
    const applyFunc = autoMappingConfig[indexType];
    if (!applyFunc) continue;

    applyFunc(id);
  }
}
