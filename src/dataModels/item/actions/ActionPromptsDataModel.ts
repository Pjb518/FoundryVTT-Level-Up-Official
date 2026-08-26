import fields = foundry.data.fields;
import DataModel = foundry.abstract.DataModel;

// ======================================================
//                        Schemas
// ======================================================
const baseSchema = () => ({
	default: new fields.BooleanField({ required: true, nullable: false, initial: true }),
	label: new fields.StringField({ required: true, nullable: false, initial: '' }),
	id: new fields.StringField({ required: true, nullable: false, persisted: false }),
});

const abilityCheckSchema = () => ({
	ability: new fields.StringField({ required: true, nullable: false, initial: 'str' }),
	type: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		initial: 'abilityCheck',
	}),
	...baseSchema(),
});

const abilitySaveSchema = () => ({
	ability: new fields.StringField({ required: true, nullable: false, initial: 'str' }),
	saveDC: new fields.SchemaField({
		bonus: new fields.StringField({ required: true, nullable: false, initial: '' }),
		type: new fields.StringField({ required: true, nullable: false, initial: 'spellcasting' }),
	}),
	onSave: new fields.StringField({ required: true, nullable: false, initial: '' }),
	type: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		initial: 'savingThrow',
	}),
	...baseSchema(),
});

const genericSchema = () => ({
	formula: new fields.StringField({ required: true, nullable: false, initial: '' }),
	type: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		initial: 'generic',
	}),
	...baseSchema(),
});

const skillCheckSchema = () => ({
	ability: new fields.StringField({ required: true, nullable: false, initial: '' }),
	skill: new fields.StringField({ required: true, nullable: false, initial: 'acr' }),
	type: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		initial: 'skillCheck',
	}),
	...baseSchema(),
});

const effectPromptSchema = () => ({
	effectId: new fields.StringField({ required: true, nullable: false, initial: '' }),
	type: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		initial: 'effect',
	}),
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

/** @deprecated */
declare namespace EffectPromptData {
	type Schema = DataSchema & ReturnType<typeof effectPromptSchema>;
}

// ======================================================
//                       Classes
// ======================================================

export class AbilityCheckPromptData extends DataModel<AbilityCheckPromptData.Schema> {
	static type = 'abilityCheck';

	static override defineSchema(): AbilityCheckPromptData.Schema {
		return {
			...abilityCheckSchema(),
		};
	}
}

export class GenericPromptData extends DataModel<GenericPromptData.Schema> {
	static type = 'generic';

	static override defineSchema(): GenericPromptData.Schema {
		return {
			...genericSchema(),
		};
	}
}

export class SkillCheckPromptData extends DataModel<SkillCheckPromptData.Schema> {
	static type = 'skillCheck';

	static override defineSchema(): SkillCheckPromptData.Schema {
		return {
			...skillCheckSchema(),
		};
	}
}

export class SavingThrowPromptData extends DataModel<SavingThrowPromptData.Schema> {
	static type = 'savingThrow';

	static override defineSchema(): SavingThrowPromptData.Schema {
		return {
			...abilitySaveSchema(),
		};
	}
}

/** @deprecated */
export class EffectPromptData extends DataModel<EffectPromptData.Schema> {
	static type = 'effect';

	static override defineSchema(): EffectPromptData.Schema {
		return {
			...effectPromptSchema(),
		};
	}
}

export const ACTION_PROMPT_DATA_TYPES = {
	abilityCheck: AbilityCheckPromptData,
	generic: GenericPromptData,
	savingThrow: SavingThrowPromptData,
	skillCheck: SkillCheckPromptData,
	/** @deprecated */
	effect: EffectPromptData,
} as const;
