import NumericalGrantConfig from '#view/components/grants/NumericalGrantConfig.svelte';
import NumericalGrantSelectionDialog from '#view/components/grants/NumericalGrantSelectionDialog.svelte';
import { skillBonusContextGrant } from '../../actor/Contexts.ts';
import { BaseGrant } from './BaseGrant.ts';
import { bonusGrantSchema } from './common.ts';

import fields = foundry.data.fields;

// ======================================================
// Schema
// ======================================================
const schema = () => ({
	// Config
	config: new fields.SchemaField({
		skills: new fields.SchemaField({
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
		context: new fields.SchemaField(skillBonusContextGrant()),
	}),

	// Applied
	applied: new fields.SchemaField(bonusGrantSchema(), { required: true, nullable: false }),

	// Deprecations
	/** @deprecated */
	skills: new fields.SchemaField({
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
	context: new fields.SchemaField(skillBonusContextGrant()),

	// Overrides
	name: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'New Skill Bonus Grant',
	}),
	type: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		initial: 'skill',
	}),
});

// ======================================================
//                      NameSpace
// ======================================================
declare namespace SkillGrant {
	type Schema = BaseGrant.Schema & ReturnType<typeof schema>;
}

class SkillGrant extends BaseGrant<SkillGrant.Schema> {
	#component = NumericalGrantSelectionDialog;

	#configComponent = NumericalGrantConfig;

	#type = 'skill';

	static override type = 'skill';

	static override defineSchema(): SkillGrant.Schema {
		// @ts-expect-error
		return {
			...super.defineSchema(),
			...schema(),
		};
	}

	override getApplyData(actor: Character, data: any = {}): any {
		if (!actor) return {};
		const selected = data?.selected ?? this.config.skills.base ?? [];

		// Construct bonus
		const bonusId = foundry.utils.randomID();
		const bonus = {
			context: {
				skills: selected,
				...this.config.context,
			},
			formula: this.config.bonus,
			label: this.name || this.parent?.name || 'Skill Grant',
			default: this.config.context.default ?? true,
			img: this.img || this?.parent?.img,
		};

		// delete bonus.context.default;

		const grantData = {
			itemUuid: this.parent.uuid,
			grantId: this._id,
			bonusId,
			type: 'skills',
			grantType: 'bonus',
			level: this.level,
		};

		return {
			[`system.bonuses.skills.${bonusId}`]: bonus,
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
			base: this.config.skills.base,
			bonus: this.config.bonus,
			choices: this.config.skills.options,
			configObject: CONFIG.A5E.skills,
			count: this.config.skills.total,
			heading: 'Skill Grant Selection',
			selected: data?.selected ?? [],
		};
	}

	override requiresConfig() {
		return !!this.config.skills.options.length;
	}

	override async configureGrant() {
		const dialogData = {
			document: this.parent,
			grantId: this._id,
			grantType: 'skills',
		};

		super.configureGrant('Configure Skill Grant', dialogData, this.#configComponent, {
			width: 400,
		});
	}

	static override migrateData(source: any, options: any) {
		options ??= {};
		source = super.migrateData(source, options);

		if (source.config) return source;
		source.config ??= {};
		source.config.skills = source.skills;
		source.config.bonus = source.bonus;
		source.config.context = source.context;

		return source;
	}
}

export { SkillGrant };
