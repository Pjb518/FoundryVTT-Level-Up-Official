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

const InitiativeBonusSchema = () => ({});
export const InitiativeBonusContext = () => ({ ...InitiativeBonusSchema() });
export const InitiativeBonusContextGrant = () => ({
	...InitiativeBonusSchema(),
	...grantContextCommon(),
});
const movementBonusSchema = () => ({});
export const movementBonusContext = () => ({ ...movementBonusSchema() });
export const movementBonusContextGrant = () => ({
	...movementBonusSchema(),
	...grantContextCommon(),
});
const sensesBonusSchema = () => ({});
export const sensesBonusContext = () => ({ ...sensesBonusSchema() });
export const sensesBonusContextGrant = () => ({ ...sensesBonusSchema(), ...grantContextCommon() });
const skillBonusSchema = () => ({});
export const skillBonusContext = () => ({ ...skillBonusSchema() });
export const skillBonusContextGrant = () => ({ ...skillBonusSchema(), ...grantContextCommon() });

export function getHitPointsBonusContext() {
	return {
		// @ts-expect-error
		perLevel: new fields.BooleanField({ required: true, initial: false }),
	};
}

export function getInitiativeBonusContext(type: 'grant' | 'bonus') {
	const schema: Record<string, any> = {
		abilities: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
			initial: Object.keys(CONFIG.A5E.abilities),
		}),
		skills: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
			initial: Object.keys(CONFIG.A5E.skills),
		}),
	};

	if (type === 'grant') {
		// @ts-expect-error
		schema.default = new fields.BooleanField({ required: true, initial: true });
	}

	return schema;
}

export function getMovementBonusContext(type: 'grant' | 'bonus') {
	const schema: any = {
		// @ts-expect-error
		isHover: new fields.BooleanField({ required: true, initial: false }),
		// valueIfOriginalIsZero: new fields.StringField({ required: true, initial: '' })
	};

	if (type === 'bonus') {
		schema.movementTypes = new fields.ArrayField(
			new fields.StringField({ required: true, initial: '' }),
			{ initial: [] },
		);
	}

	return schema;
}

export function getSensesBonusContext(type: 'grant' | 'bonus') {
	const schema: any = {
		// @ts-expect-error
		otherwiseBlind: new fields.BooleanField({ required: true, initial: false }),
		// valueIfOriginalIsZero: new fields.StringField({ required: true, initial: '' })
	};

	if (type === 'bonus') {
		schema.senses = new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
			initial: [],
		});
	}

	return schema;
}

export function getSkillBonusContext(type: 'grant' | 'bonus') {
	const schema: any = {
		// @ts-expect-error
		passiveOnly: new fields.BooleanField({ required: true, initial: false }),
		// @ts-expect-error
		requiresProficiency: new fields.BooleanField({ required: true, initial: false }),
	};

	if (type === 'bonus') {
		schema.skills = new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
			initial: [],
		});
	}

	if (type === 'grant') {
		// @ts-expect-error
		schema.default = new fields.BooleanField({ required: true, initial: true });
	}

	return schema;
}
