/* eslint-disable max-classes-per-file */
const { fields } = foundry.data;

// ======================================================
//                        Schemas
// ======================================================
const baseSchema = () => ({
	default: new fields.BooleanField({ required: true, nullable: false, initial: true }),
	label: new fields.StringField({ required: true, nullable: false, initial: '' }),
	type: new fields.StringField({ required: true, nullable: false, initial: '' }),
});

const abilityCheckSchema = () => ({
	ability: new fields.StringField({ required: true, nullable: false, initial: 'str' }),
	bonus: new fields.StringField({ required: true, nullable: false, initial: '' }),
	...baseSchema(),
});

const attackRollSchema = () => ({
	ability: new fields.StringField({ required: true, nullable: false, initial: 'default' }),
	attackType: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'meleeWeaponAttack',
		choices: ['meleeWeaponAttack', 'rangedWeaponAttack', 'meleeSpellAttack', 'rangedSpellAttack'],
	}),
	bonus: new fields.StringField({ required: true, nullable: false, initial: '' }),
	critThreshold: new fields.NumberField({ required: true, nullable: false, initial: 20 }),
	proficient: new fields.BooleanField({ required: true, nullable: false, initial: true }),
	...baseSchema(),
});

const damageRollSchema = () => ({
	canCrit: new fields.BooleanField({ required: true, nullable: false, initial: true }),
	critBonus: new fields.StringField({ required: true, nullable: false, initial: '' }),
	damageType: new fields.StringField({ required: true, nullable: false, initial: '' }),
	formula: new fields.StringField({ required: true, nullable: false, initial: '' }),
	scaling: new fields.ObjectField({ required: true, nullable: false }), // TODO: Make this proper
	...baseSchema(),
});

const genericRollSchema = () => ({
	formula: new fields.StringField({ required: true, nullable: false, initial: '' }),
	scaling: new fields.ObjectField({ required: true, nullable: false }), // TODO: Make this proper
	...baseSchema(),
});

const healingRollSchema = () => ({
	formula: new fields.StringField({ required: true, nullable: false, initial: '' }),
	healingType: new fields.StringField({ required: true, nullable: false, initial: 'healing' }),
	scaling: new fields.ObjectField({ required: true, nullable: false }), // TODO: Make this proper
	...baseSchema(),
});

const savingThrowSchema = () => ({
	ability: new fields.StringField({ required: true, nullable: false, initial: 'str' }),
	bonus: new fields.StringField({ required: true, nullable: false, initial: '' }),
	...baseSchema(),
});

const skillCheckRollSchema = () => ({
	ability: new fields.StringField({ required: true, nullable: false, initial: '' }),
	skill: new fields.StringField({ required: true, nullable: false, initial: 'acr' }),
	bonus: new fields.StringField({ required: true, nullable: false, initial: '' }),
	...baseSchema(),
});

const toolCheckRollSchema = () => ({
	ability: new fields.StringField({ required: true, nullable: false, initial: '' }),
	tool: new fields.StringField({ required: true, nullable: false, initial: 'airVehicles' }),
	bonus: new fields.StringField({ required: true, nullable: false, initial: '' }),
	...baseSchema(),
});

// ======================================================
//                      NameSpaces
// ======================================================
declare namespace AbilityCheckRollData {
	type Schema = foundry.data.fields.DataSchema & ReturnType<typeof abilityCheckSchema>;
}

declare namespace AttackRollData {
	type Schema = foundry.data.fields.DataSchema & ReturnType<typeof attackRollSchema>;
}

declare namespace DamageRollData {
	type Schema = foundry.data.fields.DataSchema & ReturnType<typeof damageRollSchema>;
}

declare namespace GenericRollData {
	type Schema = foundry.data.fields.DataSchema & ReturnType<typeof genericRollSchema>;
}

declare namespace HealingRollData {
	type Schema = foundry.data.fields.DataSchema & ReturnType<typeof healingRollSchema>;
}

declare namespace SavingThrowRollData {
	type Schema = foundry.data.fields.DataSchema & ReturnType<typeof savingThrowSchema>;
}

declare namespace SkillCheckRollData {
	type Schema = foundry.data.fields.DataSchema & ReturnType<typeof skillCheckRollSchema>;
}

declare namespace ToolCheckRollData {
	type Schema = foundry.data.fields.DataSchema & ReturnType<typeof toolCheckRollSchema>;
}

// ======================================================
//                       Classes
// ======================================================
class AbilityCheckRollData extends foundry.abstract.DataModel<
	AbilityCheckRollData.Schema,
	foundry.abstract.Document<'Item', any, any>
> {
	static override defineSchema(): AbilityCheckRollData.Schema {
		return {
			...abilityCheckSchema(),
		};
	}
}

class AttackRollData extends foundry.abstract.DataModel<
	AttackRollData.Schema,
	foundry.abstract.Document<'Item', any, any>
> {
	static override defineSchema(): AttackRollData.Schema {
		return {
			...attackRollSchema(),
		};
	}
}

class DamageRollData extends foundry.abstract.DataModel<
	DamageRollData.Schema,
	foundry.abstract.Document<'Item', any, any>
> {
	static override defineSchema(): DamageRollData.Schema {
		return {
			...damageRollSchema(),
		};
	}
}

class GenericRollData extends foundry.abstract.DataModel<
	GenericRollData.Schema,
	foundry.abstract.Document<'Item', any, any>
> {
	static override defineSchema(): GenericRollData.Schema {
		return {
			...genericRollSchema(),
		};
	}
}

class HealingRollData extends foundry.abstract.DataModel<
	HealingRollData.Schema,
	foundry.abstract.Document<'Item', any, any>
> {
	static override defineSchema(): HealingRollData.Schema {
		return {
			...healingRollSchema(),
		};
	}
}

class SavingThrowRollData extends foundry.abstract.DataModel<
	SavingThrowRollData.Schema,
	foundry.abstract.Document<'Item', any, any>
> {
	static override defineSchema(): SavingThrowRollData.Schema {
		return {
			...savingThrowSchema(),
		};
	}
}

class SkillCheckRollData extends foundry.abstract.DataModel<
	SkillCheckRollData.Schema,
	foundry.abstract.Document<'Item', any, any>
> {
	static override defineSchema(): SkillCheckRollData.Schema {
		return {
			...skillCheckRollSchema(),
		};
	}
}

class ToolCheckRollData extends foundry.abstract.DataModel<
	ToolCheckRollData.Schema,
	foundry.abstract.Document<'Item', any, any>
> {
	static override defineSchema(): ToolCheckRollData.Schema {
		return {
			...toolCheckRollSchema(),
		};
	}
}

export type A5eActionRolls = ((
	| AbilityCheckRollData
	| AttackRollData
	| DamageRollData
	| GenericRollData
	| HealingRollData
	| SavingThrowRollData
	| SkillCheckRollData
	| ToolCheckRollData
) & {
	type:
		| 'abilityCheck'
		| 'attack'
		| 'damage'
		| 'generic'
		| 'healing'
		| 'savingThrow'
		| 'skillCheck'
		| 'toolCheck';
})[];

export {
	AbilityCheckRollData,
	AttackRollData,
	DamageRollData,
	GenericRollData,
	HealingRollData,
	SavingThrowRollData,
	SkillCheckRollData,
	ToolCheckRollData,
};
