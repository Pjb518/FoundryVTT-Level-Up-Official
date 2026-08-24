import { A5ECharacterData } from './CharacterDataModel.ts';
import { A5ENPCData } from './NPCDataModel.ts';

const actorDataModels = {
	character: A5ECharacterData,
	npc: A5ENPCData,
};

export default actorDataModels;

// Merge types into fvtt-types

declare module 'fvtt-types/configuration' {
	interface DataModelConfig {
		Actor: {
			character: typeof A5ECharacterData;
			npc: typeof A5ENPCData;
		};
	}
}
