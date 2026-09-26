import fields = foundry.data.fields;

const baseSchema = () => ({
	itemUuid: new fields.StringField({
		required: true,
		nullable: false,
		initial: undefined,
	}),
	grantId: new fields.StringField({ required: true, nullable: false, initial: undefined }),
	level: new fields.NumberField({ required: true, nullable: false, initial: 1, min: 1 }),
	isApplied: new fields.BooleanField({ required: true, nullable: false, initial: false }),
});

export const bonusGrantSchema = () => ({
	...baseSchema(),
	grantType: new fields.StringField({ required: true, nullable: false, initial: 'bonus' }),
	bonusId: new fields.StringField({ required: true, nullable: false, initial: '' }),
	bonusType: new fields.StringField({ required: true, nullable: false, initial: '' }),
});

export const documentGrantSchema = () => ({
	...baseSchema(),
	grantType: new fields.StringField({ required: true, nullable: false, initial: 'document' }),
	documentIds: new fields.SetField(
		new fields.StringField({ required: true, nullable: false, initial: undefined }),
	),
});

// Convert to Bonus Grant
export const exertionGrantSchema = () => ({
	...baseSchema(),
	grantType: new fields.StringField({ required: true, nullable: false, initial: 'exertion' }),
	exertionType: new fields.StringField({ required: true, nullable: false, initial: '' }),
	bonusId: new fields.StringField({ required: true, nullable: false, initial: '' }),
	poolType: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'none',
		choices: ['none', 'prof', 'doubleProf'],
	}),
	type: new fields.StringField({ required: true, nullable: false, initial: '' }),
});

export const expertiseDiceGrantSchema = () => ({
	...baseSchema(),
	grantType: new fields.StringField({ required: true, nullable: false, initial: 'expertiseDice' }),
	selected: new fields.ArrayField(
		new fields.StringField({ required: true, nullable: false, initial: '' }),
		{ required: true, nullable: false, initial: [] },
	),
	total: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
	expertiseCount: new fields.NumberField({ required: true, nullable: false, initial: 1 }),
	expertiseType: new fields.StringField({ required: true, nullable: false, initial: '' }),
});

export const proficiencyGrantSchema = () => ({
	...baseSchema(),
	grantType: new fields.StringField({ required: true, nullable: false, initial: 'proficiency' }),
	selected: new fields.ArrayField(
		new fields.StringField({ required: true, nullable: false, initial: '' }),
		{ required: true, nullable: false, initial: [] },
	),
	upgraded: new fields.BooleanField({ required: true, nullable: false, initial: false }),
});

export const rollOverrideGrantSchema = () => ({
	...baseSchema(),
	grantType: new fields.StringField({ required: true, nullable: false, initial: 'rollOverride' }),
	selected: new fields.ArrayField(
		new fields.StringField({ required: true, nullable: false, initial: '' }),
		{ required: true, nullable: false, initial: [] },
	),
	total: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
	overrideType: new fields.StringField({ required: true, nullable: false, initial: '' }),
	rollMode: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
});

export const skillSpecialtyGrantSchema = () => ({
	...baseSchema(),
	grantType: new fields.StringField({ required: true, nullable: false, initial: 'skillSpecialty' }),
	selected: new fields.ArrayField(
		new fields.StringField({ required: true, nullable: false, initial: '' }),
		{ required: true, nullable: false, initial: [] },
	),
	total: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
	skill: new fields.StringField({ required: true, nullable: false, initial: '' }),
});

export const traitGrantSchema = () => ({
	...baseSchema(),
	grantType: new fields.StringField({ required: true, nullable: false, initial: 'trait' }),
	selected: new fields.ArrayField(
		new fields.StringField({ required: true, nullable: false, initial: '' }),
		{ required: true, nullable: false, initial: [] },
	),
	total: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
	traitType: new fields.StringField({ required: true, nullable: false, initial: '' }),
});
