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

	type SelectionProps = ReturnType<ProficiencyGrant['getSelectionComponentProps']>;
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

	override getApplyData(actor: Character, data: { selected?: string[] }) {
		if (!actor) return {};
		const selected: string[] = data.selected ?? [...this.config.keys.base] ?? [];

		const updates: Record<string, any> = {};

		// Construct applied Data
		const appliedData = {
			grantType: this.#type,
			selected,
			level: this.level,
			upgraded: this.config.upgradeToExpertise,
			isApplied: true,

			_id: this.item.id,
		};

		// TODO: Somehow batch these
		// Add to batch Update
		this.item.update({
			[`system.grants.${this.id}.applied`]: appliedData,
		});

		// Construct proficiency updates
		const configObject = prepareProficiencyConfigObject();
		const updateProps: Record<string, string[]> = {};

		selected.forEach((value) => {
			if (!value.includes(':')) return;
			const parts = value.split(':');
			if (parts.length < 2) return;

			const [profType, val] = parts;
			if (profType === 'savingThrow') {
				updates[`system.abilities.${val}.save.proficient`] = true;
			} else if (profType === 'skill') {
				if (actor.system.skills[val].proficient) {
					updates[`system.skills.${val}.expertiseDice`] = actor.system.skils[val].expertiseDice + 1;
				} else {
					updates[`system.skills.${val}.proficient`] = this.config.isExpertise ? 2 : 1;
				}
			} else {
				updateProps[profType] ??= [];
				updateProps[profType].push(val);
			}
		});

		Object.entries(updateProps).forEach(([profType, values]) => {
			const propKey = configObject[profType].propertyKey;
			if (!propKey) return;

			const proficiencies = new Set([
				...values,
				...((foundry.utils.getProperty(actor, propKey) as string[]) ?? []),
			]);

			updates[propKey] = [...proficiencies];
		});

		return updates;
	}

	override getSelectionComponent() {
		return this.#component;
	}

	override getSelectionComponentProps(data: any) {
		return {
			base: this.config.keys.base ?? [],
			choices: this.config.keys.options,
			selected: (data?.selected as string[]) ?? ([] as string[]),
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
		source.config.keys = { base: source.keys?.base?.map?.((v) => `${source.proficiencyType}${v}`) };
		if (source.keys.options?.length) {
			source.config.keys.options = [
				{
					count: source.keys.total,
					candidates: source.keys.options.map((v) => `${source.proficiencyType}${v}}`),
				},
			];
		}
		source.config.isExpertise = source.isExpertise;

		return source;
	}
}

/**
 * value = propType:subType:value/*
 */

export { ProficiencyGrant };
