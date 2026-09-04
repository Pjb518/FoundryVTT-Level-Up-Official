import fields = foundry.data.fields;

export const scalingFieldBase = () => ({
	formula: new fields.SchemaField({
		value: new fields.StringField({ required: true, nullable: false, initial: '' }),
	}),
	mode: new fields.StringField({ required: true, nullable: true, initial: null }),
	step: new fields.NumberField({ required: false, nullable: true }),
});

export type ScalingDataBase = ReturnType<typeof scalingFieldBase>;

export const scalingFieldArea = () => ({
	formula: new fields.SchemaField({
		height: new fields.StringField({ required: true, nullable: false, initial: '1' }),
		width: new fields.StringField({ required: true, nullable: false, initial: '1' }),
		length: new fields.StringField({ required: true, nullable: false, initial: '1' }),
		quantity: new fields.StringField({ required: true, nullable: false, initial: '' }),
	}),
	mode: new fields.StringField({ required: true, nullable: true, initial: null }),
	step: new fields.NumberField({ required: false, nullable: true }),
});

export type ScalingDataArea = ReturnType<typeof scalingFieldArea>;
