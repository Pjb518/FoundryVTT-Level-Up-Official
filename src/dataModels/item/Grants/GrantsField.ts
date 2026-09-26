import type { AnyObject } from 'fvtt-types/utils';
import { ITEM_GRANT_TYPES } from './index.ts';

import fields = foundry.data.fields;

// ======================================================
//                   Grant Typed Element
// ======================================================
class GrantElement<
		const Types extends fields.TypedSchemaField.Types,
		const Options extends
			fields.TypedSchemaField.Options<Types> = fields.TypedSchemaField.DefaultOptions,
		const AssignmentType = fields.TypedSchemaField.AssignmentType<Types, Options>,
		const InitializedType = fields.TypedSchemaField.InitializedType<Types, Options>,
		const PersistedType = fields.TypedSchemaField.PersistedType<Types, Options>,
	>
	extends fields.TypedSchemaField<Options, AssignmentType, InitializedType, PersistedType>
	implements fields.DataField.Internal.NestedFieldImplementation
{
	/** Override this so we can call it */
	#getTypeSchema(type: string) {
		if (typeof type !== 'string') return;
		if (!Object.hasOwn(this.types, type)) return;
		return this.types[type];
	}

	/** Override this to add missing fields */
	// @ts-expect-error
	override _cleanType(
		value: InitializedType,
		options?: fields.DataField.CleanOptions,
		_state?: fields.DataField.UpdateState,
	): InitializedType {
		const type =
			// @ts-expect-error
			foundry.data.operators.DataFieldOperator.get(value.type || value.grantType) ??
			// @ts-expect-error
			_state?.source?.type ??
			// @ts-expect-error
			_state?.source?.grantType;
		const schema = this.#getTypeSchema(type);
		if (!schema) return value;
		// @ts-expect-error
		if (options?.addTypes) value.type = type;
		// @ts-expect-error
		if (type !== _state?.source?.type) options = Object.freeze({ ...options, partial: false }); // Require full clean
		return schema.clean(value, options, _state);
	}

	/** Override this to stop throwing type error */
	// @ts-expect-error
	override _validateType(value: InitializedType, options?: any) {
		if (typeof value !== 'object') throw new Error('does not have a valid type');
		// @ts-expect-error
		let typeValue = value.type || value.grantType || options.model?._source[this.fieldPath]?.type;
		typeValue = foundry.data.operators.DataFieldOperator.get(typeValue);
		const schema = this.#getTypeSchema(typeValue);
		if (!schema) throw new Error('does not have a valid type');
		if (options.recursive === false) return;
		return schema.validate(value, options);
	}

	// @ts-expect-error
	override initialize(
		value: PersistedType,
		model: foundry.abstract.DataModel.Any,
		options?: fields.DataField.InitializeOptions | undefined,
	): InitializedType | (() => InitializedType | null) {
		// @ts-expect-error
		const schema = this.#getTypeSchema(value?.type ?? value?.grantType);
		if (!schema) return value as unknown as InitializedType;

		return schema.initialize(value, model, options);
	}
}

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
		// @ts-expect-error
		const field = new GrantElement(ITEM_GRANT_TYPES);
		options.validateKey ||= (key) => foundry.data.validators.isValidId(key);
		// @ts-expect-error
		super(field, options, context);
	}

	override initialize(
		value: PersistedType,
		model: foundry.abstract.DataModel.Any,
		options?: fields.DataField.InitializeOptions | undefined,
	): InitializedType | (() => InitializedType | null) {
		// @ts-expect-error
		options.clean = true;
		return super.initialize(value, model, options);
	}
}

export type Grant = Item.OfType<'feature'>['system']['grants'][string];
export type GrantTypes = keyof typeof ITEM_GRANT_TYPES;
export { GrantsField };
