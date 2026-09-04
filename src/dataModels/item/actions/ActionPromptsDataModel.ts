import { localize } from '#utils/localization/localize.ts';

import fields = foundry.data.fields;
import DataModel = foundry.abstract.DataModel;

// ======================================================
//                        Schemas
// ======================================================
const baseSchema = () => ({
	default: new fields.BooleanField({ required: true, nullable: false, initial: true }),
	label: new fields.StringField({ required: true, nullable: false, initial: '' }),
	defaultLabel: new fields.StringField({ required: true, nullable: false, persisted: false }),
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
	dc: new fields.NumberField({ persisted: false, required: true, nullable: false, initial: 0 }),
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

	formulaInvalid = false;

	prepareBaseData() {
		this.ability ??= 'str';

		if (!this.label) {
			const label = localize('A5E.rollLabels.specificAbilityCheck', {
				ability: CONFIG.A5E.abilities[this.ability],
			});

			this.defaultLabel = label;
		}
	}

	prepareDerivedData() {}
}

export class GenericPromptData extends DataModel<GenericPromptData.Schema> {
	static type = 'generic';

	static override defineSchema(): GenericPromptData.Schema {
		return {
			...genericSchema(),
		};
	}

	formulaInvalid = false;

	prepareBaseData() {
		if (!this.label) {
			const label = localize('A5E.actions.labels.other');
			this.defaultLabel = label;
		}

		// Check if invalid
		this.formulaInvalid = false;
		if (!this.formula || !Roll.validate(this.formula)) this.formulaInvalid = true;
	}

	prepareDerivedData() {}
}

export class SkillCheckPromptData extends DataModel<SkillCheckPromptData.Schema> {
	static type = 'skillCheck';

	static override defineSchema(): SkillCheckPromptData.Schema {
		return {
			...skillCheckSchema(),
		};
	}

	formulaInvalid = false;

	prepareBaseData() {
		this.skill ??= 'acr';
		this.ability ??= 'dex';

		if (!this.label) {
			const label = localize('A5E.skillLabels.checks.skillSpecific', {
				skill: CONFIG.A5E.skills[this.skill],
			});

			this.defaultLabel = label;
		}
	}

	prepareDerivedData() {}
}

export class SavingThrowPromptData extends DataModel<SavingThrowPromptData.Schema> {
	static type = 'savingThrow';

	static override defineSchema(): SavingThrowPromptData.Schema {
		return {
			...abilitySaveSchema(),
		};
	}

	formulaInvalid = false;

	prepareBaseData() {
		this.ability ??= 'str';

		if (!this.label) {
			const label = localize('A5E.rollLabels.prompts.savingThrow', {
				ability: CONFIG.A5E.abilities[this.ability],
			});

			this.defaultLabel = label;
		}

		// Check if invalid
		this.formulaInvalid = false;
		if (this.saveDC.bonus && !Roll.validate(this.saveDC.bonus)) this.formulaInvalid = true;
	}

	prepareDerivedData() {}
}

/** @deprecated */
export class EffectPromptData extends DataModel<EffectPromptData.Schema> {
	static type = 'effect';

	static override defineSchema(): EffectPromptData.Schema {
		return {
			...effectPromptSchema(),
		};
	}

	formulaInvalid = true;

	prepareBaseData() {}

	prepareDerivedData() {}
}

export const ACTION_PROMPT_DATA_TYPES = {
	abilityCheck: AbilityCheckPromptData,
	generic: GenericPromptData,
	savingThrow: SavingThrowPromptData,
	skillCheck: SkillCheckPromptData,
	/** @deprecated */
	effect: EffectPromptData,
} as const;
