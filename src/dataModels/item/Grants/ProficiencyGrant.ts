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
			base: new fields.ArrayField(
				new fields.StringField({ required: true, nullable: false, initial: '' }),
				{ required: true, nullable: false },
			),
			options: new fields.ArrayField(
				new fields.StringField({ required: true, nullable: false, initial: '' }),
				{ required: true, initial: [] },
			),
			total: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
		}),
		bonus: new fields.StringField({ required: true, nullable: false, initial: '' }),
		proficiencyType: new fields.StringField({ required: true, nullable: false, initial: 'armor' }),
		isExpertise: new fields.BooleanField({ required: true, nullable: false, initial: true }),
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
	bonus: new fields.StringField({ required: true, nullable: false, initial: '' }),
	/** @deprecated */
	proficiencyType: new fields.StringField({ required: true, nullable: false, initial: 'armor' }),
	/** @deprecated */
	isExpertise: new fields.BooleanField({ required: true, nullable: false, initial: true }),

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
		const selected: string[] = data?.selected ?? this.keys.base ?? [];
		const count: number = this.keys.total;

		const updates: Record<string, any> = {};

		// Construct grant
		const grantData = {
			proficiencyData: {
				keys: selected,
				total: count,
				proficiencyType: this.proficiencyType,
			},
			itemUuid: this.parent.uuid,
			grantId: this._id,
			grantType: this.#type,
			level: this.level,
		};

		updates['system.grants'] = {
			...actor.system.grants,
			[this._id]: grantData,
		};

		// Construct proficiency update
		if (this.proficiencyType === 'savingThrow') {
			selected.forEach((key: string) => {
				updates[`system.abilities.${key}.save.proficient`] = true;
			});
		} else if (this.proficiencyType === 'skill') {
			selected.forEach((key: string) => {
				updates[`system.skills.${key}.proficient`] = this.isExpertise ? 2 : 1;
			});
		} else {
			const configObject = prepareProficiencyConfigObject();
			const { propertyKey } = configObject[this.proficiencyType] ?? {};
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
			base: this.keys.base ?? [],
			choices: this.keys.options,
			count: this.keys.total,
			proficiencyType: this.proficiencyType,
			selected: data?.selected ?? [],
		};
	}

	override requiresConfig(): boolean {
		return !!this.keys.options.length;
	}

	override async configureGrant() {
		const dialogData = {
			document: this.parent,
			grantId: this._id,
		};

		super.configureGrant('Configure Proficiency Grant', dialogData, this.#configComponent, {
			width: 400,
		});
	}
}

export { ProficiencyGrant };
