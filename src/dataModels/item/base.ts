import type { MigrationData, SlugData } from '../common.ts';
import { migrationData, slugData } from '../common.ts';
import { description, favorite, macro, secretDescription, source } from './common';
import type {
	DescriptionData,
	FavoriteData,
	MacroData,
	SecretDescriptionData,
	SourceData,
} from './common.ts';

declare namespace A5EBaseItemData {
	interface Schema
		extends DataSchema,
			DescriptionData,
			FavoriteData,
			MacroData,
			MigrationData,
			SecretDescriptionData,
			SourceData,
			SlugData {}
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
			...slugData(),
		};
	}
}

export { A5EBaseItemData };
