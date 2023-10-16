import registerSystemSettings from '../settings';
import registerConditionsConfig from '../config/registerConditionsConfig';

async function createMonsterIndex() {
  const monsters = game.packs.get('a5e.a5e-monsters');

  monsters.getIndex({
    fields: [
      'system.cr',
      'system.description',
      'system.details.creatureTypes',
      'system.details.isSwarm',
      'system.elite'
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

export default function setup() {
  registerSystemSettings();
  registerConditionsConfig();
  createMonsterIndex();
  createSpellIndex();
}
