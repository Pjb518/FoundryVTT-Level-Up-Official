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
	ability: new fields.StringField({ required: true, nullable: false, initial: '' }), // TODO: Action - Set to proper
	...baseSchema(),
});

const abilitySaveSchema = () => ({
	ability: new fields.StringField({ required: true, nullable: false, initial: '' }), // TODO: Action - Set to proper
	saveDC: new fields.SchemaField({
		bonus: new fields.StringField({ required: true, nullable: false, initial: '' }),
		type: new fields.StringField({ required: true, nullable: false, initial: '' }),
	}),
	onSave: new fields.StringField({ required: true, nullable: false, initial: '' }),
	...baseSchema(),
});

const genericSchema = () => ({
	formula: new fields.StringField({ required: true, nullable: false, initial: '' }),
	...baseSchema(),
});

const skillCheckSchema = () => ({
	ability: new fields.StringField({ required: true, nullable: false, initial: '' }),
	skill: new fields.StringField({ required: true, nullable: false, initial: '' }),
	...baseSchema(),
});

// ======================================================
//                      NameSpaces
// ======================================================

declare namespace AbilityCheckPromptData {
	type Schema = DataSchema & ReturnType<typeof abilityCheckSchema>;
}

declare namespace GenericPromptData {
	type Schema = DataSchema & ReturnType<typeof genericSchema>;
}

declare namespace SkillCheckPromptData {
	type Schema = DataSchema & ReturnType<typeof skillCheckSchema>;
}

declare namespace SavingThrowPromptData {
	type Schema = DataSchema & ReturnType<typeof abilitySaveSchema>;
}

// ======================================================
//                       Classes
// ======================================================

class AbilityCheckPromptData extends foundry.abstract.DataModel<
	AbilityCheckPromptData.Schema,
	foundry.abstract.Document<DataSchema, any, any>
> {
	static override defineSchema(): AbilityCheckPromptData.Schema {
		return {
			...abilityCheckSchema(),
		};
	}
}

class GenericPromptData extends foundry.abstract.DataModel<
	GenericPromptData.Schema,
	foundry.abstract.Document<DataSchema, any, any>
> {
	static override defineSchema(): GenericPromptData.Schema {
		return {
			...genericSchema(),
		};
	}
}

class SkillCheckPromptData extends foundry.abstract.DataModel<
	SkillCheckPromptData.Schema,
	foundry.abstract.Document<DataSchema, any, any>
> {
	static override defineSchema(): SkillCheckPromptData.Schema {
		return {
			...skillCheckSchema(),
		};
	}
}

class SavingThrowPromptData extends foundry.abstract.DataModel<
	SavingThrowPromptData.Schema,
	foundry.abstract.Document<DataSchema, any, any>
> {
	static override defineSchema(): SavingThrowPromptData.Schema {
		return {
			...abilitySaveSchema(),
		};
	}
}

export { AbilityCheckPromptData, GenericPromptData, SkillCheckPromptData, SavingThrowPromptData };
