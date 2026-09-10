import fields = foundry.data.fields;

const grantContextCommon = () => ({
	default: new fields.BooleanField({ required: true, nullable: false, initial: true }),
});

// -------------------------------------
// Ability Bonus Contexts
// -------------------------------------
const abilityBonusSchema = () => ({
	types: new fields.ArrayField(
		new fields.StringField({ required: true, initial: '', nullable: false }),
		{
			initial: ['check', 'save'],
		},
	),
	requiresProficiency: new fields.BooleanField({
		required: true,
		nullable: false,
		initial: false,
	}),
});

export const abilitiesBonusContext = () => ({
	...abilityBonusSchema(),
	abilities: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
		initial: [],
	}),
});

export const abilitiesBonusContextGrant = () => ({
	...abilityBonusSchema(),
	...grantContextCommon(),
});

// -------------------------------------
// Attack Bonus Contexts
// -------------------------------------
const attackBonusSchema = () => ({
	spellLevels: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
		initial: [],
	}),
	requiresProficiency: new fields.BooleanField({ required: true, initial: false }),
});

export const attackBonusContext = () => ({
	...attackBonusSchema(),
	attackTypes: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
		initial: [],
	}),
});

export const attackBonusContextGrant = () => ({
	...attackBonusSchema(),
	...grantContextCommon(),
});

// -------------------------------------
// Damage Bonus Contexts
// -------------------------------------
const damageBonusSchema = () => ({
	attackTypes: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
		initial: [],
	}),
	damageTypes: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
		initial: [],
	}),
	isCritBonus: new fields.BooleanField({ required: true, initial: false }),
	spellLevels: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
		initial: [],
	}),
});

export const damageBonusContext = () => ({ ...damageBonusSchema() });
export const damageBonusContextGrant = () => ({ ...damageBonusSchema, ...grantContextCommon });

// -------------------------------------
// Healing Bonus Contexts
// -------------------------------------
const healingBonusSchema = () => ({
	healingTypes: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
		initial: ['healing'],
	}),
	spellLevels: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
		initial: [],
	}),
});

export const healingBonusContext = () => ({ ...healingBonusSchema() });
export const healingBonusContextGrant = () => ({
	...healingBonusSchema(),
	...grantContextCommon(),
});

// -------------------------------------
// Hit Points Contexts
// -------------------------------------
const hitPointsBonusSchema = () => ({
	perLevel: new fields.BooleanField({ required: true, initial: false }),
});

export const hitPointsBonusContext = () => ({ ...hitPointsBonusSchema() });

export const hitPointsBonusContextGrant = () => ({
	...hitPointsBonusSchema(),
	...grantContextCommon(),
});

// -------------------------------------
// Initiative Contexts
// -------------------------------------
const initiativeBonusSchema = () => ({
	abilities: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
		initial: Object.keys(CONFIG.A5E.abilities),
	}),
	skills: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
		initial: Object.keys(CONFIG.A5E.skills),
	}),
});

export const initiativeBonusContext = () => ({ ...initiativeBonusSchema() });
export const initiativeBonusContextGrant = () => ({
	...initiativeBonusSchema(),
	...grantContextCommon(),
});

// -------------------------------------
// Movement Bonus Contexts
// -------------------------------------
const movementBonusSchema = () => ({
	isHover: new fields.BooleanField({ required: true, initial: false }),
});

export const movementBonusContext = () => ({
	...movementBonusSchema(),
	movementTypes: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
		initial: [],
	}),
});

export const movementBonusContextGrant = () => ({
	...movementBonusSchema(),
	...grantContextCommon(),
});

// -------------------------------------
// Senses Bonus Contexts
// -------------------------------------
const sensesBonusSchema = () => ({
	otherwiseBlind: new fields.BooleanField({ required: true, initial: false }),
});

export const sensesBonusContext = () => ({
	...sensesBonusSchema(),
	senses: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
		initial: [],
	}),
});

export const sensesBonusContextGrant = () => ({ ...sensesBonusSchema(), ...grantContextCommon() });

// -------------------------------------
// Skill Bonus Contexts
// -------------------------------------
const skillBonusSchema = () => ({
	passiveOnly: new fields.BooleanField({ required: true, initial: false }),
	requiresProficiency: new fields.BooleanField({ required: true, initial: false }),
});

export const skillBonusContext = () => ({
	...skillBonusSchema(),
	skills: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
		initial: [],
	}),
});

export const skillBonusContextGrant = () => ({ ...skillBonusSchema(), ...grantContextCommon() });
