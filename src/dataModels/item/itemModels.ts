import { A5EArchetypeData } from './ArchetypeDataModel';
import { A5EBackgroundData } from './BackgroundDataModel';
import { A5EClassData } from './ClassDataModel';
import { A5ECultureData } from './CultureDataModel';
import { A5EDestinyData } from './DestinyDataModel';
import { A5EHeritageData } from './HeritageDataModel';

import { A5EFeatureData } from './FeatureDataModel';
import { A5EManeuverData } from './ManeuverDataModel';
import { A5EObjectData } from './ObjectDataModel';
import { A5ESpellData } from './SpellDataModel';

const itemDataModels = {
  archetype: A5EArchetypeData,
  background: A5EBackgroundData,
  class: A5EClassData,
  culture: A5ECultureData,
  destiny: A5EDestinyData,
  heritage: A5EHeritageData,

  feature: A5EFeatureData,
  maneuver: A5EManeuverData,
  object: A5EObjectData,
  spell: A5ESpellData
};

export default itemDataModels;
