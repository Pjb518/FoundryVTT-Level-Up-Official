export type PartySheetStoreData = {
	currentTab?: string;
};

export const partySheetStore: Record<string, PartySheetStoreData> = $state({});
