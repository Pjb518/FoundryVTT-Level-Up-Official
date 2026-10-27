import fields = foundry.data.fields;

// ======================================================
//                        Schemas
// ======================================================
const TYPE_OPTS = { required: true, nullable: false, blank: false };

const baseSchema = () => ({
	name: new fields.StringField({ required: true, nullable: false, initial: '' }),
	slug: new fields.StringField({ required: true, nullable: false, initial: '' }),
	per: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'longRest',
		choices: () => CONFIG.A5E.resourceRecoveryOptions,
	}),
});

const diceSchema = () => ({
	size: new fields.StringField({ required: true, nullable: false, initial: 1 }),
	denom: new fields.StringField({ required: true, nullable: false, initial: 1 }),
	modifiers: new fields.SetField(
		new fields.StringField({ required: true, nullable: false, initial: '' }),
		{ required: true, nullable: false },
	),
	type: new fields.StringField({ ...TYPE_OPTS, initial: 'dice' }),
	...baseSchema(),
});

const itemSchema = () => ({
	type: new fields.StringField({ ...TYPE_OPTS, initial: 'item' }),
	...baseSchema(),
});

const poolSchema = () => ({
	type: new fields.StringField({ ...TYPE_OPTS, initial: 'pool' }),
	...baseSchema(),
});

const usesSchema = () => ({
	value: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
	type: new fields.StringField({ ...TYPE_OPTS, initial: 'uses' }),
	...baseSchema(),
});

// ======================================================
//                       NameSpaces
// ======================================================

// ======================================================
//                        Classes
// ======================================================

// ======================================================
//                        Exports
// ======================================================

export const RESOURCE_DATA_TYPES = {};
