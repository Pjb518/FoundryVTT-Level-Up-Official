import NumericalGrantConfig from '#view/components/grants/NumericalGrantConfig.svelte';
import NumericalGrantSelectionDialog from '#view/components/grants/NumericalGrantSelectionDialog.svelte';
import { attackBonusContextGrant } from '../../actor/Contexts.ts';
import { BaseGrant } from './BaseGrant.ts';
import { bonusGrantSchema } from './common.ts';

import fields = foundry.data.fields;

// ======================================================
// Schema
// ======================================================
const schema = () => ({
	// CONFIG
	config: new fields.SchemaField({
		attackTypes: new fields.SchemaField({
			base: new fields.ArrayField(
				new fields.StringField({ required: true, nullable: false, initial: '' }),
				{ required: true, initial: [] },
			),
			options: new fields.ArrayField(
				new fields.StringField({ required: true, nullable: false, initial: '' }),
				{ required: true, initial: [] },
			),
			total: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
		}),
		bonus: new fields.StringField({ required: true, nullable: false, initial: '' }),
		context: new fields.SchemaField(attackBonusContextGrant()),
	}),

	// Applied
	applied: new fields.SchemaField(bonusGrantSchema(), { required: true, nullable: false }),

	// Deprecations
	/** @deprecated */
	attackTypes: new fields.SchemaField({
		/** @deprecated */
		base: new fields.ArrayField(
			new fields.StringField({ required: true, nullable: false, initial: '' }),
			{ required: true, initial: [] },
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
	context: new fields.SchemaField(attackBonusContextGrant()),

	// Overrides
	name: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'New Attack Bonus Grant',
	}),
	type: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		initial: 'attack',
	}),
});

// ======================================================
//                      NameSpace
// ======================================================
declare namespace AttackGrant {
	type Schema = BaseGrant.Schema & ReturnType<typeof schema>;
}

class AttackGrant extends BaseGrant<AttackGrant.Schema> {
	#component = NumericalGrantSelectionDialog;

	#configComponent = NumericalGrantConfig;

	#type = 'attack';

	static override type = 'attack';

	static override defineSchema(): AttackGrant.Schema {
		// @ts-expect-error
		return {
			...super.defineSchema(),
			...schema(),
		};
	}

	override getApplyData(actor: Character, data: any) {
		if (!actor) return {};

		const selected = data?.selected ?? this.config.attackTypes.base ?? [];

		// Construct bonus
		const bonusId = foundry.utils.randomID();
		const bonus = {
			context: {
				attackTypes: selected,
				...this.config.context,
			},
			formula: this.config.bonus,
			label: this.name || this.item?.name || 'Attack Grant',
			default: this.config.context.default ?? true,
			img: this.img || this?.item?.img,
		};

		const appliedData: typeof this.applied = {
			bonusId,
			bonusType: 'attacks',
			grantType: 'bonus',
			level: this.level,
			isApplied: true,
		};

		this.item.update({
			[`system.grants.${this.id}.applied`]: appliedData,
		});

		return {
			[`system.bonuses.attacks.${bonusId}`]: bonus,
		};
	}

	override getSelectionComponent() {
		return this.#component;
	}

	override getSelectionComponentProps(data: any) {
		return {
			base: this.config.attackTypes.base ?? [],
			bonus: this.config.bonus,
			choices: this.config.attackTypes.options,
			configObject: CONFIG.A5E.attackTypes,
			count: this.config.attackTypes.total,
			heading: 'Attack Grant Selection',
			selected: data?.selected ?? [],
		};
	}

	override requiresConfig(): boolean {
		return !!this.config.attackTypes.options.length;
	}

	override async configureGrant() {
		const dialogData = {
			document: this.item,
			grantId: this.id,
			grantType: 'attacks',
		};

		super.configureGrant('Configure Attack Grant', dialogData, this.#configComponent, {
			width: 400,
		});
	}

	static override migrateData(source: any, options: any) {
		options ??= {};
		source = super.migrateData(source, options);

		source.config ??= {};
		source.config.attackTypes ??= source.attackTypes;
		source.config.bonus ||= source.bonus;
		source.config.context ??= source.context;

		return source;
	}
}

export { AttackGrant };
