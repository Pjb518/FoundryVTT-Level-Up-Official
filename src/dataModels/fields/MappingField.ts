import type { AnyObject, SimpleMerge } from 'fvtt-types/utils';

import fields = foundry.data.fields;
import DataField = foundry.data.fields.DataField;
import DataModel = foundry.abstract.DataModel;

declare namespace MappingField {
	type DefaultOptions = SimpleMerge<
		fields.TypedObjectField.DefaultOptions,
		{
			initialKeys: undefined;
			initialValue: undefined;
			initialKeysOnly: false;
			entryLabel: undefined;
			expandKeys: false;
		}
	>;

	interface Options<BaseAssignmentType>
		extends fields.TypedObjectField.Options<BaseAssignmentType> {
		initialKeys?: string[] | undefined;

		initialValue?: (key: string, initial: any) => Element | undefined;

		initialKeysOnly?: boolean | undefined;

		entryLabel?: (key: string) => string | undefined;
	}
}

/**
 * A subclass of TypedObjectField that represents a mapping of keys to the provided DataField type.
 */
class MappingField<
	const Element extends DataField.Any,
	const Options extends MappingField.Options<AnyObject> = MappingField.DefaultOptions,
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
	/**  The embedded DataField definition which is contained in this field. */
	model: Element;

	declare initialKeys: string[] | undefined;

	declare initialValue: (key: string, initial: any, source?: unknown) => Element | undefined;

	declare initialKeysOnly: boolean;

	constructor(model: Element, options?: Options, context?: DataField.ConstructionContext) {
		if (!(model instanceof DataField)) {
			throw new Error('MappingField must have a DataField as its contained element');
		}
		super(model, options, context);

		this.model = this.element;
	}

	/* -------------------------------------------- */

	/** @inheritDoc */
	static override get _defaults() {
		return foundry.utils.mergeObject(super._defaults, {
			initialKeys: undefined,
			initialValue: undefined,
			initialKeysOnly: false,
			entryLabel: undefined,
			expandKeys: false,
		});
	}

	/* -------------------------------------------- */

	/** @inheritDoc */
	override getInitialValue(source?: unknown): InitializedType {
		let keys = this.initialKeys;
		const initial = super.getInitialValue(source);
		if (!keys || !foundry.utils.isEmpty(initial)) return initial;
		if (!Array.isArray(keys)) keys = Object.keys(keys);
		for (const key of keys) initial[key] = this._getInitialValueForKey(key, source);
		return initial;
	}

	/* -------------------------------------------- */

	/** Get the initial value for the provided key. */
	_getInitialValueForKey(key: string, source?: unknown): InitializedType {
		const initial = this.element.getInitialValue();
		// @ts-expect-error
		return this.initialValue?.(key, initial, source) ?? initial;
	}

	/* -------------------------------------------- */

	override initialize(
		value: PersistedType,
		model: DataModel.Any,
		options?: DataField.InitializeOptions,
	): InitializedType | (() => InitializedType | null) {
		if (!value) return value as unknown as InitializedType;
		const obj = {};
		const initialKeys = Array.isArray(this.initialKeys)
			? this.initialKeys
			: Object.keys(this.initialKeys ?? {});
		const keys = this.initialKeysOnly ? initialKeys : Object.keys(value);
		for (const key of keys) {
			const data = value[key] ?? this._getInitialValueForKey(key, value);
			obj[key] = this.element.initialize(data, model, options);
		}
		return obj as unknown as InitializedType;
	}

	/* -------------------------------------------- */

	override _getField(parts: string[], options = {}) {
		if (parts.length === 0) return this;
		parts.pop();
		// @ts-expect-error
		return this.element._getField(parts, options);
	}

	/* -------------------------------------------- */

	/**
	 * Get the formatted label for the specified field within the element of the provided key.
	 */
	getFieldLabel(key: string, parts: string[] = []): string | void {
		// @ts-expect-error
		const field = this.element._getField(parts);
		if (!field) return;
		// @ts-expect-error
		const name = this.entryLabel?.(key);
		// @ts-expect-error
		if (!field.options.labelFormatter || !name) return field.label;
		// @ts-expect-error
		return _loc(field.options.labelFormatter, { name });
	}
}

export { MappingField };
