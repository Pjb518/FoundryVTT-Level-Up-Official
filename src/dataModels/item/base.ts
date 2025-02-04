import type {
	DescriptionData,
	FavoriteData,
	MacroData,
	SecretDescriptionData,
	SourceData,
} from './common';
import type { MigrationData } from '../common';

import { description, favorite, macro, secretDescription, source } from './common';
import { migrationData } from '../common';

declare namespace A5EBaseItemData {
	interface Schema
		extends foundry.data.fields.DataSchema,
			DescriptionData,
			FavoriteData,
			MacroData,
			MigrationData,
			SecretDescriptionData,
			SourceData {}
	type BaseData = Record<string, any>;
	type DerivedData = Record<string, any>;
}

class A5EBaseItemData<
	Schema extends A5EBaseItemData.Schema,
	BaseData extends A5EBaseItemData.BaseData,
	DerivedData extends A5EBaseItemData.DerivedData,
> extends foundry.abstract.TypeDataModel<Schema, Item.Implementation, BaseData, DerivedData> {
	/** @inheritDoc */
	static override defineSchema(): A5EBaseItemData.Schema {
		return {
			...description(),
			...favorite(),
			...macro(),
			...migrationData(),
			...secretDescription(),
			...source(),
		};
	}
}

// eslint-disable-next-line import/prefer-default-export
export { A5EBaseItemData };
