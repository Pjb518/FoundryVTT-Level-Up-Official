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
	bonus: new fields.StringField({ required: true, nullable: false, initial: '' }),
	type: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		initial: 'abilityCheck',
	}),
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
	type: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		initial: 'attack',
	}),
	...baseSchema(),
});

const damageRollSchema = () => ({
	canCrit: new fields.BooleanField({ required: true, nullable: false, initial: true }),
	critBonus: new fields.StringField({ required: true, nullable: false, initial: '' }),
	damageType: new fields.StringField({ required: true, nullable: false, initial: '' }),
	formula: new fields.StringField({ required: true, nullable: false, initial: '' }),
	scaling: new fields.ObjectField({ required: true, nullable: false }), // TODO: Make this proper
	type: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		initial: 'damage',
	}),
	...baseSchema(),
});

const genericRollSchema = () => ({
	formula: new fields.StringField({ required: true, nullable: false, initial: '' }),
	scaling: new fields.ObjectField({ required: true, nullable: false }), // TODO: Make this proper
	type: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		initial: 'generic',
	}),
	...baseSchema(),
});

const healingRollSchema = () => ({
	formula: new fields.StringField({ required: true, nullable: false, initial: '' }),
	healingType: new fields.StringField({ required: true, nullable: false, initial: 'healing' }),
	scaling: new fields.ObjectField({ required: true, nullable: false }), // TODO: Make this proper
	type: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		initial: 'healing',
	}),
	...baseSchema(),
});

const savingThrowSchema = () => ({
	ability: new fields.StringField({ required: true, nullable: false, initial: 'str' }),
	bonus: new fields.StringField({ required: true, nullable: false, initial: '' }),
	type: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		initial: 'savingThrow',
	}),
	...baseSchema(),
});

const skillCheckRollSchema = () => ({
	ability: new fields.StringField({ required: true, nullable: false, initial: '' }),
	skill: new fields.StringField({ required: true, nullable: false, initial: 'acr' }),
	bonus: new fields.StringField({ required: true, nullable: false, initial: '' }),
	type: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		initial: 'skillCheck',
	}),
	...baseSchema(),
});

const toolCheckRollSchema = () => ({
	ability: new fields.StringField({ required: true, nullable: false, initial: '' }),
	tool: new fields.StringField({ required: true, nullable: false, initial: 'airVehicles' }),
	bonus: new fields.StringField({ required: true, nullable: false, initial: '' }),
	type: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		initial: 'toolCheck',
	}),
	...baseSchema(),
});

// -----------------------------------
// Namespaces
// -----------------------------------
declare namespace AbilityCheckRollData {
	type Schema = DataSchema & ReturnType<typeof abilityCheckSchema>;
}

declare namespace AttackRollData {
	type Schema = DataSchema & ReturnType<typeof attackRollSchema>;
}

declare namespace DamageRollData {
	type Schema = DataSchema & ReturnType<typeof damageRollSchema>;
}

declare namespace GenericRollData {
	type Schema = DataSchema & ReturnType<typeof genericRollSchema>;
}

declare namespace HealingRollData {
	type Schema = DataSchema & ReturnType<typeof healingRollSchema>;
}

declare namespace SavingThrowRollData {
	type Schema = DataSchema & ReturnType<typeof savingThrowSchema>;
}

declare namespace SkillCheckRollData {
	type Schema = DataSchema & ReturnType<typeof skillCheckRollSchema>;
}

declare namespace ToolCheckRollData {
	type Schema = DataSchema & ReturnType<typeof toolCheckRollSchema>;
}

// -----------------------------------
// Classes
// -----------------------------------
// TODO: Add Action as parent
export class AbilityCheckRollData extends DataModel<AbilityCheckRollData.Schema> {
	static type = 'abilityCheck';

	static override defineSchema(): AbilityCheckRollData.Schema {
		return {
			...abilityCheckSchema(),
		};
	}

	prepareBaseData() {
		this.ability ??= 'str';

		if (!this.label) {
			const label = localize('A5E.rollLabels.specificAbilityCheck', {
				ability: CONFIG.A5E.abilities[this.ability],
			});

			this.defaultLabel = label;
		}
	}
}

export class AttackRollData extends DataModel<AttackRollData.Schema> {
	static type = 'attack';

	static override defineSchema(): AttackRollData.Schema {
		return {
			...attackRollSchema(),
		};
	}

	prepareBaseData() {}
}

export class DamageRollData extends DataModel<DamageRollData.Schema> {
	static type = 'damage';

	static override defineSchema(): DamageRollData.Schema {
		return {
			...damageRollSchema(),
		};
	}

	prepareBaseData() {
		if (!this.label) {
			const label = localize('A5E.damage.labels.specific', {
				damageType: CONFIG.A5E.damageTypes[this.damageType] ?? '',
			});

			this.defaultLabel = label;
		}
	}
}

export class GenericRollData extends DataModel<GenericRollData.Schema> {
	static type = 'generic';

	static override defineSchema(): GenericRollData.Schema {
		return {
			...genericRollSchema(),
		};
	}

	prepareBaseData() {
		if (!this.label) {
			const label = localize('A5E.actions.labels.other');
			this.defaultLabel = label;
		}
	}
}

export class HealingRollData extends DataModel<HealingRollData.Schema> {
	static type = 'healing';

	static override defineSchema(): HealingRollData.Schema {
		return {
			...healingRollSchema(),
		};
	}

	prepareBaseData() {
		this.healingType ??= 'healing';

		if (!this.label) {
			const label = localize(CONFIG.A5E.healingTypes[this.healingType] ?? '');
			this.defaultLabel = label;
		}
	}
}

export class SavingThrowRollData extends DataModel<SavingThrowRollData.Schema> {
	static type = 'savingThrow';

	static override defineSchema(): SavingThrowRollData.Schema {
		return {
			...savingThrowSchema(),
		};
	}

	prepareBaseData() {
		this.ability ??= 'str';

		if (!this.label) {
			const label = localize('A5E.rollLabels.prompts.savingThrow', {
				ability: CONFIG.A5E.abilities[this.ability],
			});

			this.defaultLabel = label;
		}
	}
}

export class SkillCheckRollData extends DataModel<SkillCheckRollData.Schema> {
	static type = 'skillCheck';

	static override defineSchema(): SkillCheckRollData.Schema {
		return {
			...skillCheckRollSchema(),
		};
	}

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
}

export class ToolCheckRollData extends DataModel<ToolCheckRollData.Schema> {
	static type = 'toolCheck';

	static override defineSchema(): ToolCheckRollData.Schema {
		return {
			...toolCheckRollSchema(),
		};
	}

	prepareBaseData() {
		this.tool ??= 'airVehicles';

		if (!this.label) {
			const label = localize('A5E.actions.labels.toolCheckSpecific', {
				tool: CONFIG.A5E.toolsFlattened[this.tool],
			});

			this.defaultLabel = label;
		}
	}
}

export const ACTION_ROLL_DATA_TYPES = {
	abilityCheck: AbilityCheckRollData,
	attack: AttackRollData,
	damage: DamageRollData,
	generic: GenericRollData,
	healing: HealingRollData,
	savingThrow: SavingThrowRollData,
	skillCheck: SkillCheckRollData,
	toolCheck: ToolCheckRollData,
} as const;
