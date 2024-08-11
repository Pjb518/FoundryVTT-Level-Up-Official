import { A5eRollCardData } from './RollCardDataModel';

const chatDataModels = {
  roll: A5eRollCardData
};

export default chatDataModels;

// Merge types into fvtt-types
declare global {
  interface DataModelConfig {
    ChatMessage: {
      roll: A5eRollCardData
    }
  }
}
