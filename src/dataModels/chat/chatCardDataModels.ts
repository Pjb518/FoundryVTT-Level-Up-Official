import { A5eItemCardData } from './ItemCardDataModel';
import { A5eRollCardData } from './RollCardDataModel';

const chatDataModels = {
	item: A5eItemCardData,
	roll: A5eRollCardData,
};

export default chatDataModels;

// Merge types into fvtt-types
declare global {
	interface DataModelConfig {
		ChatMessage: {
			item: A5eItemCardData;
			roll: A5eRollCardData;
		};
	}
}
