import * as indexFunctions from '../utils/createIndexes';

import registerSystemSettings from '../settings';
import registerConditionsConfig from '../config/registerConditionsConfig';

export default function setup() {
  registerSystemSettings();
  registerConditionsConfig();

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

  Object.values(fancyPackData).forEach(({ packs, func }) => {
    packs.forEach((pack) => func(pack));
  });
}
