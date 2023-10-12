import registerSystemSettings from '../settings';
import registerConditionsConfig from '../config/registerConditionsConfig';

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
  createSpellIndex();
}
