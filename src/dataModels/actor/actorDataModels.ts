import { A5ECharacterData } from './CharacterDataModel';
import { A5ENPCData } from './NPCDataModel';
import { A5ENarratorData } from './NarratorDataModel';

const actorDataModels = {
  character: A5ECharacterData,
  npc: A5ENPCData,
  narrator: A5ENarratorData
};

export default actorDataModels;

// Merge types into fvtt-types
declare global {
  interface DataModelConfig {
    Actor: {
      character: A5ECharacterData;
      npc: A5ENPCData;
      narrator: A5ENarratorData;
    }
  }
}
