import registerSystemSettings from '../settings';
import registerConditionsConfig from '../config/registerConditionsConfig';

async function createMonsterIndex() {
  const monsters = game.packs.get('a5e.a5e-monsters');

  monsters.getIndex({
    fields: [
      'system.description',
      'system.details.cr',
      'system.details.creatureTypes',
      'system.details.elite',
      'system.details.isSwarm'
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
      'system.details.isSwarm'
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
  createMonsterIndex();
  createSpellIndex();
  create5eMonsterIndex();
  create5eSpellIndex();
}
