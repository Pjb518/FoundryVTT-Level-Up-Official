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
	...abilitiesBonusContext(),
	abilities: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
		initial: [],
	}),
});

export const abilitiesBonusContextGrant = () => ({
	...abilitiesBonusContext,
	...grantContextCommon,
});

export function getAbilitiesBonusContext(type: 'grant' | 'bonus') {
	const schema = {
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
	};

	if (type === 'grant') return { ...schema, ...grantContextCommon() };

	return {
		...schema,
	};
}

export function getAttackBonusContext(type: 'grant' | 'bonus') {
	const schema = {
		spellLevels: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
			initial: [],
		}),
		requiresProficiency: new fields.BooleanField({ required: true, initial: false }),
	};

	if (type === 'grant') return { ...schema, ...grantContextCommon() };

	return {
		...schema,
		attackTypes: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
			initial: [],
		}),
	};
}

export function getDamageBonusContext(type: 'grant' | 'bonus') {
	const schema = {
		attackTypes: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
			initial: [],
		}),
		damageTypes: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
			initial: [],
		}),
		// @ts-expect-error
		isCritBonus: new fields.BooleanField({ required: true, initial: false }),
		spellLevels: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
			initial: [],
		}),
	};

	if (type === 'grant') {
		// @ts-expect-error
		schema.default = new fields.BooleanField({ required: true, initial: true });
	}

	return schema;
}

export function getHealingBonusContext(type: 'grant' | 'bonus') {
	const schema: Record<string, any> = {
		healingTypes: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
			initial: ['healing'],
		}),
		spellLevels: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
			initial: [],
		}),
	};

	if (type === 'grant') {
		// @ts-expect-error
		schema.default = new fields.BooleanField({ required: true, initial: true });
	}

	return schema;
}

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
