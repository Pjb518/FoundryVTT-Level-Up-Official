import { A5ECharacterData } from './CharacterDataModel.ts';
import { A5EFollowerData } from './FollowerDataModel.ts';
import { A5ENPCData } from './NPCDataModel.ts';
import { A5EPartyData } from './PartyDataModel.ts';
import { A5EVehicleData } from './VehicleDataModel.ts';

const actorDataModels = {
	character: A5ECharacterData,
	npc: A5ENPCData,
	party: A5EPartyData,
	follower: A5EFollowerData,
	vehicle: A5EVehicleData,
};

export default actorDataModels;

// Merge types into fvtt-types
declare module 'fvtt-types/configuration' {
	interface DataModelConfig {
		Actor: {
			character: typeof A5ECharacterData;
			npc: typeof A5ENPCData;
			party: typeof A5EPartyData;
			follower: typeof A5EFollowerData;
			vehicle: typeof A5EVehicleData;
		};
	}
}
