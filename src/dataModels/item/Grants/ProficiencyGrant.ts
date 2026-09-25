import prepareProficiencyConfigObject from '#utils/prepareProficiencyConfigObject.ts';
import ProficiencyGrantConfig from '#view/components/grants/ProficiencyGrantConfig.svelte';
import ProficiencyGrantSelection from '#view/components/grants/ProficiencyGrantSelection.svelte';
import { BaseGrant } from './BaseGrant.ts';
import { proficiencyGrantSchema } from './common.ts';

import fields = foundry.data.fields;

// ======================================================
// Schema
// ======================================================
const schema = () => ({
	// Config
	config: new fields.SchemaField({
		keys: new fields.SchemaField({
			base: new fields.SetField(
				new fields.StringField({ required: true, nullable: false, initial: '' }),
				{ required: true, nullable: false },
			),
			options: new fields.ArrayField(
				new fields.SchemaField({
					count: new fields.NumberField({ required: true, nullable: false, initial: 1 }),
					candidates: new fields.SetField(
						new fields.StringField({ required: true, nullable: false, initial: '' }),
					),
				}),
				{ required: true, initial: [] },
			),
		}),
		isExpertise: new fields.BooleanField({ required: true, nullable: false, initial: false }),
		upgradeToExpertise: new fields.BooleanField({
			required: true,
			nullable: false,
			initial: true,
		}),
	}),

	// Applied
	applied: new fields.SchemaField(proficiencyGrantSchema(), { required: true, nullable: false }),

	// Deprecations
	/** @deprecated */
	keys: new fields.SchemaField({
		/** @deprecated */
		base: new fields.ArrayField(
			new fields.StringField({ required: true, nullable: false, initial: '' }),
			{ required: true, nullable: false },
		),
		/** @deprecated */
		options: new fields.ArrayField(
			new fields.StringField({ required: true, nullable: false, initial: '' }),
			{ required: true, initial: [] },
		),
		/** @deprecated */
		total: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
	}),
	/** @deprecated */
	proficiencyType: new fields.StringField({ required: true, nullable: false, initial: 'armor' }),
	/** @deprecated */
	isExpertise: new fields.BooleanField({ required: true, nullable: false, initial: false }),

	// Overrides
	name: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'New Proficiency Bonus Grant',
	}),
	type: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		initial: 'proficiency',
	}),
});

// ======================================================
//                      NameSpace
// ======================================================
declare namespace ProficiencyGrant {
	type Schema = BaseGrant.Schema & ReturnType<typeof schema>;
}

class ProficiencyGrant extends BaseGrant<ProficiencyGrant.Schema> {
	#component = ProficiencyGrantSelection;

	#configComponent = ProficiencyGrantConfig;

	#type = 'proficiency';

	static override type = 'proficiency';

	static override defineSchema(): ProficiencyGrant.Schema {
		// @ts-expect-error
		return {
			...super.defineSchema(),
			...schema(),
		};
	}

	override getApplyData(actor: any, data: any) {
		if (!actor) return {};
		const selected: string[] = data?.selected ?? this.config.keys.base ?? [];
		const count: number = this.config.keys.total;

		const updates: Record<string, any> = {};

		// Construct grant
		const grantData = {
			proficiencyData: {
				keys: selected,
				total: count,
				proficiencyType: this.config.proficiencyType,
			},
			itemUuid: this.item?.uuid,
			grantId: this._id,
			grantType: this.#type,
			level: this.level,
		};

		updates['system.grants'] = {
			...actor.system.grants,
			[this._id]: grantData,
		};

		// Construct proficiency update
		if (this.config.proficiencyType === 'savingThrow') {
			selected.forEach((key: string) => {
				updates[`system.abilities.${key}.save.proficient`] = true;
			});
		} else if (this.config.proficiencyType === 'skill') {
			selected.forEach((key: string) => {
				updates[`system.skills.${key}.proficient`] = this.config.isExpertise ? 2 : 1;
			});
		} else {
			const configObject = prepareProficiencyConfigObject();
			const { propertyKey } = configObject[this.config.proficiencyType] ?? {};
			if (!propertyKey) return {};
			if (!selected.length) return {};

			const proficiencies = new Set([
				...selected,
				...((foundry.utils.getProperty(actor, propertyKey) as string[]) ?? []),
			]);

			updates[propertyKey] = [...proficiencies];
		}

		return updates;
	}

	override getSelectionComponent() {
		return this.#component;
	}

	override getSelectionComponentProps(data: any) {
		return {
			base: this.config.keys.base ?? [],
			choices: this.config.keys.options,
			count: this.config.keys.total,
			proficiencyType: this.config.proficiencyType,
			selected: data?.selected ?? [],
		};
	}

	override requiresConfig(): boolean {
		return !!this.config.keys.options.length;
	}

	override async configureGrant() {
		const dialogData = {
			document: this.item ?? this.parent?.parent,
			grantId: this.id,
		};

		super.configureGrant('Configure Proficiency Grant', dialogData, this.#configComponent, {
			width: 800,
		});
	}

	static override migrateData(source: any, options: any) {
		options ??= {};
		source = super.migrateData(source, options);

		if (source.config) return source;
		source.config ??= {};
		source.config.keys = { base: source.keys?.base };
		if (source.options?.length) {
			source.config.keys.options = [
				{
					count: source.total,
					candidates: source.options,
				},
			];
		}

		source.config.isExpertise = source.isExpertise;
		source.config.proficiencyType = source.proficiencyType;

		return source;
	}
}

/**
 * value = propType:subType:value/*
 */

export { ProficiencyGrant };
