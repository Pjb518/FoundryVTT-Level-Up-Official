import type { AnyObject } from 'fvtt-types/utils';
import { ITEM_GRANT_TYPES } from './index.ts';

import fields = foundry.data.fields;

// ======================================================
//                   Grants Field
// ======================================================
class GrantsField<
	const Element extends fields.DataField.Any = InstanceType<
		typeof fields.TypedSchemaField<typeof ITEM_GRANT_TYPES>
	>,
	const Options extends
		fields.TypedObjectField.Options<AnyObject> = fields.TypedObjectField.DefaultOptions,
	const AssignmentType = fields.TypedObjectField.AssignmentType<Element, Options>,
	const InitializedType = fields.TypedObjectField.InitializedType<Element, Options>,
	const PersistedType extends
		| AnyObject
		| null
		| undefined = fields.TypedObjectField.InitializedType<Element, Options>,
> extends fields.TypedObjectField<
	Element,
	Options,
	AssignmentType,
	InitializedType,
	PersistedType
> {
	constructor(options = {} as Options, context = {} as fields.DataField.ConstructionContext) {
		const field = new fields.TypedSchemaField(ITEM_GRANT_TYPES);
		options.validateKey ||= (key) => foundry.data.validators.isValidId(key);
		super(field, options, context);
	}
}
