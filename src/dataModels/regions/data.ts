export type RegionEvent<Data extends object> = foundry.documents.RegionDocument.RegionEvent & {
	data: Data;
};
