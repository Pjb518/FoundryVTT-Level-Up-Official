import { A5EArchetypeData } from './ArchetypeDataModel.ts';
import { A5EBackgroundData } from './BackgroundDataModel.ts';
import { A5EClassData } from './ClassDataModel.ts';
import { A5ECultureData } from './CultureDataModel.ts';
import { A5EDestinyData } from './DestinyDataModel.ts';
import { A5EHeritageData } from './HeritageDataModel.ts';

import { A5EFeatureData } from './FeatureDataModel.ts';
import { A5EInteractionData } from './InteractionDataModel.ts';
import { A5EManeuverData } from './ManeuverDataModel.ts';
import { A5EObjectData } from './ObjectDataModel.ts';
import { A5ESpellData } from './SpellDataModel.ts';

const itemDataModels = {
	archetype: A5EArchetypeData,
	background: A5EBackgroundData,
	class: A5EClassData,
	culture: A5ECultureData,
	destiny: A5EDestinyData,
	heritage: A5EHeritageData,

	feature: A5EFeatureData,
  interaction: A5EInteractionData,
	maneuver: A5EManeuverData,
	object: A5EObjectData,
	spell: A5ESpellData,
};

export default itemDataModels;

// Merge types into fvtt-types
declare global {
	interface DataModelConfig {
		Item: {
			archetype: A5EArchetypeData;
			background: A5EBackgroundData;
			class: A5EClassData;
			culture: A5ECultureData;
			destiny: A5EDestinyData;
			heritage: A5EHeritageData;

			feature: A5EFeatureData;
      interaction: A5EInteractionData;
			maneuver: A5EManeuverData;
			object: A5EObjectData;
			spell: A5ESpellData;
		};
	}
}
