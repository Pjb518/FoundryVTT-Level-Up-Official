import type {
	DescriptionData,
	FavoriteData,
	MacroData,
	RevitalizeLockData,
	SecretDescriptionData,
	SourceData,
} from './common';
import type { MigrationData } from '../common';

import { description, favorite, macro, revitalizeLock, secretDescription, source } from './common';
import { migrationData } from '../common';

declare namespace A5EBaseItemData {
	interface Schema
		extends DataSchema,
			DescriptionData,
			FavoriteData,
			MacroData,
			MigrationData,
			RevitalizeLockData,
			SecretDescriptionData,
			SourceData {}
	type BaseData = Record<string, any>;
	type DerivedData = Record<string, any>;
}

class A5EBaseItemData<
	Schema extends A5EBaseItemData.Schema,
	BaseData extends A5EBaseItemData.BaseData,
	DerivedData extends A5EBaseItemData.DerivedData,
> extends foundry.abstract.TypeDataModel<Schema, Item.ConfiguredInstance, BaseData, DerivedData> {
	/** @inheritDoc */
	static override defineSchema(): A5EBaseItemData.Schema {
		return {
			...description(),
			...favorite(),
			...macro(),
			...migrationData(),
			...revitalizeLock(),
			...secretDescription(),
			...source(),
		};
	}
}

// eslint-disable-next-line import/prefer-default-export
export { A5EBaseItemData };
