import { A5eCheckCardData } from './CheckCardDataModel';

const chatDataModels = {
  check: A5eCheckCardData
};

export default chatDataModels;

// Merge types into fvtt-types
declare global {
  interface DataModelConfig {
    ChatMessage: {
      check: A5eCheckCardData
    }
  }
}
