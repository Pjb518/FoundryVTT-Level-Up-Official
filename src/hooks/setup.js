import registerSystemSettings from '../settings';
<<<<<<< HEAD
=======

// import SpellCompendiumSheet from '../apps/SpellCompendiumSheet';
>>>>>>> ea357887a (WIP! Finishes off the settings panel. Healing and damage bonuses are missing from this section.)
import registerConditionsConfig from '../config/registerConditionsConfig';

async function createAdventuringGearIndex() {
  const adventuringGear = game.packs.get('a5e.a5e-adventuring-gear');

  adventuringGear.getIndex({
    fields: [
      'system.bulky',
      'system.objectType',
      'system.price'
    ]
  });
}

async function createMagicItemIndex() {
  const magicItems = game.packs.get('a5e.a5e-magic-items');

  magicItems.getIndex({
    fields: [
      'system.requiresAttunement',
      'system.bulky',
      'system.objectType',
      'system.price',
      'system.rarity'
    ]
  });
}

async function createManeuverIndex() {
  const maneuvers = game.packs.get('a5e.a5e-maneuvers');

  maneuvers.getIndex({
    fields: [
      'system.description',
      'system.exertionCost',
      'system.degree',
      'system.isStance',
      'system.tradition'
    ]
  });
}

async function createMonsterIndex() {
  const monsters = game.packs.get('a5e.a5e-monsters');

  monsters.getIndex({
    fields: [
      'system.description',
      'system.details.cr',
      'system.details.creatureTypes',
      'system.details.elite',
      'system.details.isSwarm',
      'system.traits.size'
    ]
  });
}

async function createSpellIndex() {
  const spells = game.packs.get('a5e.a5e-spells');

  spells.getIndex({
    fields: [
      'system.concentration',
      'system.components',
      'system.classes',
      'system.description',
      'system.level',
      'system.rare',
      'system.ritual',
      'system.schools'
    ]
  });
}

async function create5eMonsterIndex() {
  const monsters = game.packs.get('a5e.dnd5e-monsters');

  monsters.getIndex({
    fields: [
      'system.description',
      'system.details.cr',
      'system.details.creatureTypes',
      'system.details.elite',
      'system.details.isSwarm',
      'system.traits.size'
    ]
  });
}

async function create5eSpellIndex() {
  const spells = game.packs.get('a5e.dnd5e-spells');

  spells.getIndex({
    fields: [
      'system.concentration',
      'system.components',
      'system.description',
      'system.level',
      'system.ritual',
      'system.schools'
    ]
  });
}

export default function setup() {
  registerSystemSettings();
  registerConditionsConfig();

<<<<<<< HEAD
  createAdventuringGearIndex();
  createMagicItemIndex();
  createManeuverIndex();
  createMonsterIndex();
  createSpellIndex();
  create5eMonsterIndex();
  create5eSpellIndex();
=======
  // TODO: REMOVE THIS RETURN ONCE 0.15.3 IS OUT!
  // Apply custom compendium styles to the SRD rules compendium.
  // const spells = game.packs.get('a5e.a5e-spells');
  // spells.applicationClass = SpellCompendiumSheet;
>>>>>>> ea357887a (WIP! Finishes off the settings panel. Healing and damage bonuses are missing from this section.)
}
