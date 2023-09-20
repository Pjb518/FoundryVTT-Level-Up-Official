import registerSystemSettings from '../settings';
import setupConditions from '../documents/activeEffect/conditions';

import SpecialCompendium from '../apps/Compendium';

export default function setup() {
  registerSystemSettings();
  setupConditions();

  // Apply custom compendium styles to the SRD rules compendium.
  const spells = game.packs.get('a5e.a5e-spells');
  spells.applicationClass = SpecialCompendium;
}
