/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable max-classes-per-file */
/* eslint-disable max-len */
/**
 * Metadata that describes a system data type.
 *
 * @typedef {object} A5EDataModelMetaData
 * @property {string} type - Name of type to which this system data model belongs.
 * @property {string} [module] - For module-defined types, which module provides this type.
 * @property {string} [category] - Which category in the create item dialog should this Document be listed?
 * @property {string} localization - Base localization key for this type. This should be a localization key that
 *                                   accepts plural types (e.g. `BF.Item.Type.Weapon` becomes
 *                                   `BF.Item.Type.Weapon[few]` and `BF.Item.Type.Weapon[other]`).
 * @property {string} [icon] - Font awesome icon string used for links to this type.
 * @property {string} [img] - Default image used when creating a Document of this type.
 */
interface A5EDataModelMetaData {
	type?: string;
	module?: string;
	category?: string;
	localization?: string;
	icon?: string;
	img?: string;
}

export default class A5EDataModel<
	Schema extends DataSchema,
	Parent extends foundry.abstract.Document<DataSchema, any, any>,
	BaseData extends Record<string, any> = Record<string, never>,
	DerivedData extends Record<string, any> = Record<string, never>,
> extends foundry.abstract.TypeDataModel<Schema, Parent, BaseData, DerivedData> {
	static metadata: A5EDataModelMetaData = {};

	get metadata() {
		return A5EDataModel.metadata;
	}

	static get fullType() {
		return this.metadata.type
			? `${this.metadata.module}.${this.metadata.type}`
			: this.metadata.module;
	}

	static _schemaTemplates: Array<any> = [];

	static _immiscible: Set<string> = new Set([
		'length',
		'mixed',
		'name',
		'prototype',
		'migrateData',
		'defineSchema',
	]);

	static override defineSchema() {
		const schema = {};
		for (const template of this._schemaTemplates) {
			if (!template.defineSchema)
				throw new Error(
					`Invalid a5e template mixin ${template} defined on class ${this.constructor}`,
				);
			this.mergeSchema(schema, template.defineSchema?.() ?? {});
		}

		return schema;
	}

	/**
	 * The field names of the base templates used for construction.
	 * @type {Set<string>}
	 * @private
	 */
	static get _schemaTemplateFields() {
		const fieldNames = Object.freeze(
			new Set(this._schemaTemplates.map((t) => t.schema.keys()).flat()),
		);

		Object.defineProperty(this, '_schemaTemplateFields', {
			value: fieldNames,
			writable: false,
			configurable: false,
		});

		return fieldNames;
	}

	static mergeSchema(schema: any, template: any): any {
		const { fields } = foundry.data;

		for (const key of Object.keys(template)) {
			if (!(key in schema) || schema[key].constructor !== template[key].constructor) {
				if (template[key] === false) delete schema[key];
				else schema[key] = template[key];
				continue;
			}

			const mergeOptions = foundry.utils.mergeObject(schema[key].options, template[key].options);
			const fieldType = template[key].constructor;

			if (fieldType === fields.SchemaField) {
				const mergedFields = this.mergeSchema(schema[key].fields, template[key].fields);

				Object.values(mergedFields).forEach((field: any) => {
					field.parent = undefined;
				});
				schema[key] = new fields.SchemaField(mergedFields, mergeOptions);
			} else if (fieldType === fields.ArrayField || fieldType === fields.SetField) {
				const elemOptions = foundry.utils.mergeObject(
					schema[key].element.options,
					template[key].element.options,
				);

				const ElemType = (template[key].element || schema[key].element).constructor;

				schema[key] = new template[key].constructor(new ElemType(elemOptions), mergeOptions);
			} else {
				schema[key] = new template[key].constructor(mergeOptions);
			}
		}

		return schema;
	}

	// eslint-disable-next-line generator-star-spacing
	protected static override *_initializationOrder(): Generator<
		[string, foundry.data.fields.DataField.Any]
	> {
		super._initializationOrder();
		for (const template of this._schemaTemplates) {
			for (const entry of template._initializationOrder()) {
				entry[1] = this.schema.get(entry[0]);
				yield entry;
			}
		}

		for (const entry of this.schema.entries()) {
			if (this._schemaTemplateFields.has(entry[0])) continue;
			yield entry;
		}
	}

	/**
	 * Mix multiple templates with the base type.
	 */
	static mixin(...templates: (typeof foundry.abstract.TypeDataModel)[]) {
		const Base = class Base<
			Schema extends DataSchema,
			Parent extends foundry.abstract.Document<DataSchema, any, any>,
			BaseData extends Record<string, any> = Record<string, never>,
			DerivedData extends Record<string, any> = Record<string, never>,
		> extends A5EDataModel<Schema, Parent, BaseData, DerivedData> {};

		Object.defineProperty(Base, '_schemaTemplates', {
			value: Object.seal([...this._schemaTemplates, ...templates]),
			writable: false,
			configurable: false,
		});

		for (const template of templates) {
			let defineSchema: PropertyDescriptor | undefined;

			// Take all static methods and fields from template and mix in to base class
			for (const [key, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(template))) {
				if (key === 'defineSchema') defineSchema = descriptor;
				if (this._immiscible.has(key)) continue;
				Object.defineProperty(Base.prototype, key, { ...descriptor, enumerable: true });
			}

			// Take all instance methods and fields from template and mix in to base class
			for (const [key, descriptor] of Object.entries(
				Object.getOwnPropertyDescriptors(template.prototype),
			)) {
				if (['constructor'].includes(key)) continue;
				Object.defineProperty(Base.prototype, key, { ...descriptor, enumerable: true });
			}

			// Copy over defineSchema with a custom name
			if (defineSchema) {
				Object.defineProperty(Base, `${template.name}_defineSchema`, defineSchema);
			}
		}

		return Base;
	}

	/**
	 * Determine whether this class mixes in a specific template.
	 */
	static mixes(template: typeof A5EDataModel | string): boolean {
		if (foundry.utils.getType(template) === 'string') {
			return this._schemaTemplates.find((t) => t.name === template) !== undefined;
		}

		return this._schemaTemplates.includes(template);
	}

	/**
	 * Helper method to get all enumerable methods, inherited or own, for this class.
	 * @param {object} options
	 * @param {string} [options.startingWith] - Optional filtering string.
	 * @param {string} [options.notEndingWith] - Exclude any method that ends with this suffix.
	 * @param {boolean} [options.prototype=true] - Whether the prototype should be checked or the class.
	 * @returns {string[]} - Array of method keys.
	 */
	static _getMethods({
		startingWith,
		notEndingWith,
		prototype = true,
	}: { startingWith?: string; notEndingWith?: string; prototype?: boolean }) {
		let keys: string[] = [];

		// eslint-disable-next-line guard-for-in
		for (const key in prototype ? this.prototype : this) {
			keys.push(key);
		}

		for (let cls of [this, ...foundry.utils.getParentClasses(this)].reverse()) {
			if (['Base', 'BaseDataModel', 'DataModel'].includes(cls.name)) continue;
			if (prototype) cls = cls.prototype;
			keys.push(...Object.getOwnPropertyNames(cls));
		}
		if (startingWith)
			keys = keys.filter((key) => key.startsWith(startingWith) && key !== startingWith);
		if (notEndingWith) keys = keys.filter((key) => !key.endsWith(notEndingWith));
		return keys;
	}

	static override migrateData(source) {
		this._getMethods({ startingWith: 'migrate', notEndingWith: 'Data', prototype: false }).forEach(
			(k) => this[k](source),
		);
		return super.migrateData(source);
	}

	override prepareBaseData() {
		A5EDataModel._getMethods({ startingWith: 'prepareBase', notEndingWith: 'Data' }).forEach((k) =>
			this[k](),
		);
	}

	prepareEmbeddedData() {
		A5EDataModel._getMethods({ startingWith: 'prepareEmbedded', notEndingWith: 'Data' }).forEach(
			(k) => this[k](),
		);
	}

	override prepareDerivedData() {
		A5EDataModel._getMethods({ startingWith: 'prepareDerived', notEndingWith: 'Data' }).forEach(
			(k) => this[k](),
		);
	}
}
