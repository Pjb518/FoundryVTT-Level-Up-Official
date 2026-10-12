export type RegionEvent<Data extends object = object> =
	foundry.documents.RegionDocument.RegionEvent & {
		data: Data;
	};
