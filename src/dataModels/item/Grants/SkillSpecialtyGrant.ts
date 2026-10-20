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
			total: new fields.NumberField({ required: true, nullable: false, initial: 1 }),
		}),
		skill: new fields.StringField({ required: true, nullable: false, initial: 'acr' }),
		selectionType: new fields.StringField({
			required: true,
			nullable: false,
			initial: 'limited',
			choices: { limited: 'Limited', pool: 'Pool' },
		}),
		pool: new fields.SchemaField({
			count: new fields.NumberField({ required: true, nullable: false, initial: 1, min: 1 }),
			proficientOnly: new fields.BooleanField({ required: true, nullable: false, initial: true }),
		}),
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

	override getApplyData(actor: Character, data: any) {
		if (!actor) return {};

		if (this.config.selectionType === 'pool') return this.#getPoolApplyData(actor, data);

		const selected: string[] = data?.selected ?? this.config.specialties.base ?? [];
		const skill: string = data?.skill ?? this.config.skill ?? 'acr';
		const count: number = this.config.specialties.total;

		if (!skill) return {};

		// Construct applied data
		const appliedData: typeof this.applied = {
			selected,
			skill,
			total: count,
			grantType: this.#type,
			level: this.level,
			isApplied: true,
		};

		// Construct specialty update
		const key = `system.skills.${skill}.specialties`;
		const existing = (foundry.utils.getProperty(actor, key) as string[]) ?? [];
		const specialties = new Set([...selected, ...existing]);

		return {
			appliedData: this._getAppliedUpdate(appliedData),
			updateData: {
				[key]: [...specialties],
			},
		};
	}

	#getPoolApplyData(actor: Character, data: any) {
		const { proficientOnly, count } = this.config.pool;
		const validSpecialties = CONFIG.A5E.skillSpecialties as Record<string, Record<string, string>>;

		const picks: { skill: string; specialty: string }[] = (data?.pool ?? [])
			.filter(
				({ skill, specialty }: { skill: string; specialty: string }) =>
					specialty in (validSpecialties[skill] ?? {}) &&
					(!proficientOnly || (actor.system.skills[skill]?.proficient ?? 0) > 0),
			)
			.slice(0, count);

		const appliedData: typeof this.applied = {
			pool: picks,
			selected: [],
			skill: '',
			total: count,
			grantType: this.#type,
			level: this.level,
			isApplied: true,
		};

		const updateData: Record<string, string[]> = {};
		picks.forEach(({ skill, specialty }) => {
			const key = `system.skills.${skill}.specialties`;
			updateData[key] ??= [...((foundry.utils.getProperty(actor, key) as string[]) ?? [])];
			if (!updateData[key].includes(specialty)) updateData[key].push(specialty);
		});

		return { appliedData: this._getAppliedUpdate(appliedData), updateData };
	}

	override getSelectionComponent() {
		return this.#component;
	}

	override getSelectionComponentProps(data: any) {
		if (this.config.selectionType === 'pool') {
			return {
				selectionType: 'pool',
				base: [],
				choices: [],
				count: this.config.pool.count,
				skill: this.config.skill,
				proficientOnly: this.config.pool.proficientOnly,
				selected: [],
				poolSelected: data?.pool ?? [],
			};
		}

		return {
			selectionType: 'limited',
			base: this.config.specialties.base ?? [],
			choices: this.config.specialties.options,
			count: this.config.specialties.total,
			skill: this.config.skill,
			selected: data?.selected ?? [],
		};
	}

	override requiresConfig(): boolean {
		if (this.config.selectionType === 'pool') return true;
		return !!this.config.specialties.options.length;
	}

	override async configureGrant(): Promise<any> {
		const dialogData = {
			document: this.item,
			grantId: this.id,
			grantType: this.#type,
		};

		super.configureGrant('Configure Skill Specialty Grant', dialogData, this.#configComponent, {
			width: 400,
		});
	}
}

export { SkillSpecialtyGrant };
