import SkillSpecialtyConfig from '#view/components/grants/SkillSpecialtyConfig.svelte';
import SkillSpecialtyGrantSelectionDialog from '#view/components/grants/SkillSpecialtyGrantSelectionDialog.svelte';
import { BaseGrant } from './BaseGrant.ts';
import { skillSpecialtyGrantSchema } from './common.ts';

import fields = foundry.data.fields;

// ======================================================
// Schema
// ======================================================
const schema = () => ({
	// Config
	config: new fields.SchemaField({
		specialties: new fields.SchemaField({
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
		skill: new fields.StringField({ required: true, nullable: false, initial: 'acr' }),
	}),
	// Applied
	applied: new fields.SchemaField(skillSpecialtyGrantSchema(), { required: true, nullable: false }),

	// Deprecations
	/** @deprecated */
	specialties: new fields.SchemaField({
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
	skill: new fields.StringField({ required: true, nullable: false, initial: '' }),

	// Overrides
	name: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'New Skill Specialty Grant',
	}),
	type: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		initial: 'skillSpecialty',
	}),
});

// ======================================================
//                      NameSpace
// ======================================================
declare namespace SkillSpecialtyGrant {
	type Schema = BaseGrant.Schema & ReturnType<typeof schema>;
}

class SkillSpecialtyGrant extends BaseGrant<SkillSpecialtyGrant.Schema> {
	#component = SkillSpecialtyGrantSelectionDialog;

	#configComponent = SkillSpecialtyConfig;

	#type = 'skillSpecialty';

	static override type = 'skillSpecialty';

	static override defineSchema(): SkillSpecialtyGrant.Schema {
		// @ts-expect-error
		return {
			...super.defineSchema(),
			...schema(),
		};
	}

	override getApplyData(actor: any, data: any) {
		if (!actor) return {};
		const selected: string[] = data?.selected ?? this.specialties.base ?? [];
		const skill: string = data?.skill ?? this.skill ?? 'acr';
		const count: number = this.specialties.total;

		if (!skill) return {};

		// Construct grant
		const grantData = {
			specialtyData: {
				specialties: selected,
				skill,
				total: count,
			},
			itemUuid: this.parent.uuid,
			grantId: this._id,
			grantType: this.#type,
			level: this.level,
		};

		// Construct specialty update
		const key = `system.skills.${skill}.specialties`;
		const existing = (foundry.utils.getProperty(actor, key) as string[]) ?? [];
		const specialties = new Set([...selected, ...existing]);

		return {
			[key]: [...specialties],
			'system.grants': {
				...actor.system.grants,
				[this._id]: grantData,
			},
		};
	}

	override getSelectionComponent() {
		return this.#component;
	}

	override getSelectionComponentProps(data: any) {
		return {
			base: this.specialties.base ?? [],
			choices: this.specialties.options,
			count: this.specialties.total,
			skill: this.skill,
			selected: data?.selected ?? [],
		};
	}

	override requiresConfig(): boolean {
		return this.specialties.options.length;
	}

	override async configureGrant(): Promise<any> {
		const dialogData = {
			document: this.parent,
			grantId: this._id,
			grantType: this.#type,
		};

		super.configureGrant('Configure Skill Specialty Grant', dialogData, this.#configComponent, {
			width: 400,
		});
	}
}

export { SkillSpecialtyGrant };
