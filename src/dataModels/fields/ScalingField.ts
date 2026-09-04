import fields = foundry.data.fields;

const common = () => ({
	/** @deprecated */
	formula: new fields.AnyField(),
	mode: new fields.StringField({ required: true, nullable: true, initial: null }),
	step: new fields.NumberField({ required: false, nullable: true }),
});

export const scalingFieldBase = () => ({
	config: new fields.SchemaField({
		value: new fields.StringField({ required: true, nullable: false, initial: '' }),
	}),
	...common(),
});

export type ScalingDataBase = ReturnType<typeof scalingFieldBase>;

export const scalingFieldArea = () => ({
	config: new fields.SchemaField({
		height: new fields.StringField({ required: true, nullable: false, initial: '1' }),
		width: new fields.StringField({ required: true, nullable: false, initial: '1' }),
		length: new fields.StringField({ required: true, nullable: false, initial: '1' }),
		quantity: new fields.StringField({ required: true, nullable: false, initial: '' }),
	}),
	...common(),
});

export type ScalingDataArea = ReturnType<typeof scalingFieldArea>;

export const scalingFieldRoll = () => ({
	config: new fields.SchemaField({
		value: new fields.StringField({ required: true, nullable: false, initial: '' }),
		number: new fields.NumberField({ required: true, nullable: false, initial: 1 }),
		denom: new fields.NumberField({ required: true, nullable: false, initial: 1 }),
	}),
	...common(),
});

export type ScalingDataRoll = ReturnType<typeof scalingFieldRoll>;
