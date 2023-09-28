import registerSystemSettings from '../settings';
import setupConditions from '../documents/activeEffect/conditions';

import SpellCompendiumSheet from '../apps/SpellCompendiumSheet';

export default function setup() {
  registerSystemSettings();
  setupConditions();

  // TODO: REMOVE THIS RETURN ONCE 0.15.3 IS OUT!
  return;

  // Apply custom compendium styles to the SRD rules compendium.
  const spells = game.packs.get('a5e.a5e-spells');
  spells.applicationClass = SpellCompendiumSheet;
}
