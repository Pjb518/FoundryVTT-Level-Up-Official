import registerSystemSettings from '../settings';

import SpellCompendiumSheet from '../apps/SpellCompendiumSheet';
import registerConditionsConfig from '../config/registerConditionsConfig';

export default function setup() {
  registerSystemSettings();
  registerConditionsConfig();

  // TODO: REMOVE THIS RETURN ONCE 0.15.3 IS OUT!
  return;

  // Apply custom compendium styles to the SRD rules compendium.
  const spells = game.packs.get('a5e.a5e-spells');
  spells.applicationClass = SpellCompendiumSheet;
}
