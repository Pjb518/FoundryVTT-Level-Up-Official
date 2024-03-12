import BackgroundDataModel from './BackgroundDataModel';
import CultureDataModel from './CultureDataModel';
import DestinyDataModel from './DestinyDataModel';
import HeritageDataModel from './HeritageDataModel';

import FeatureDataModel from './FeatureDataModel';
import ManeuverDataModel from './ManeuverDataModel';
import ObjectDataModel from './ObjectDataModel';
import SpellDataModel from './SpellDataModel';

const itemDataModels = {
  background: BackgroundDataModel,
  culture: CultureDataModel,
  destiny: DestinyDataModel,
  heritage: HeritageDataModel,

  feature: FeatureDataModel,
  maneuver: ManeuverDataModel,
  object: ObjectDataModel,
  spell: SpellDataModel
};

export default itemDataModels;
