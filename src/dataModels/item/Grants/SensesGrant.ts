import NumericalGrantConfig from '#view/components/grants/NumericalGrantConfig.svelte';
import NumericalGrantSelectionDialog from '#view/components/grants/NumericalGrantSelectionDialog.svelte';
import { sensesBonusContextGrant } from '../../actor/Contexts.ts';
import { BaseGrant } from './BaseGrant.ts';
import { bonusGrantSchema } from './common.ts';

import fields = foundry.data.fields;

// ======================================================
// Schema
// ======================================================
const schema = () => ({
	// Config
	config: new fields.SchemaField({
		senses: new fields.SchemaField({
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
		unit: new fields.StringField({ required: true, nullable: false, initial: 'feet' }),
		context: new fields.SchemaField(sensesBonusContextGrant()),
	}),

	// Applied
	applied: new fields.SchemaField(bonusGrantSchema(), { required: true, nullable: false }),

	// Deprecations
	/** @deprecated */
	senses: new fields.SchemaField({
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
	context: new fields.SchemaField(sensesBonusContextGrant()),
	/** @deprecated */
	unit: new fields.StringField({ required: true, nullable: false, initial: 'feet' }),

	// Overrides
	name: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'New Senses Grant',
	}),
	type: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		initial: 'senses',
	}),
});

// ======================================================
//                      NameSpace
// ======================================================
declare namespace SensesGrant {
	type Schema = BaseGrant.Schema & ReturnType<typeof schema>;
}

class SensesGrant extends BaseGrant<SensesGrant.Schema> {
	#component = NumericalGrantSelectionDialog;

	#configComponent = NumericalGrantConfig;

	#type = 'senses';

	static override type = 'senses';

	static override defineSchema(): SensesGrant.Schema {
		// @ts-expect-error
		return {
			...super.defineSchema(),
			...schema(),
		};
	}

	override getApplyData(actor: Character, data: any) {
		if (!actor) return {};

		const bonusId = foundry.utils.randomID();
		const bonus = {
			context: {
				senses: data?.selected ?? this.config.senses.base ?? [],
				...this.config.context,
			},
			formula: this.config.bonus,
			unit: this.config.unit || 'feet',
			label: this.name || this.parent?.name || 'Senses Grant',
			img: this.img || this?.parent?.img,
		};

		const grantData = {
			itemUuid: this.parent.uuid,
			grantId: this._id,
			bonusId,
			type: this.#type,
			grantType: 'bonus',
			level: this.level,
		};

		return {
			[`system.bonuses.senses.${bonusId}`]: bonus,
			'system.grants': {
				...actor.system.grants,
				[this._id]: grantData,
			},
		};
	}

	override getSelectionComponent() {
		return this.#component;
	}

	override getSelectionComponentProps(data: Record<string, any>) {
		return {
			base: this.config.senses.base ?? [],
			bonus: this.config.bonus,
			choices: this.config.senses.options ?? [],
			configObject: CONFIG.A5E.senses,
			count: this.config.senses.total,
			unit: this.config.unit,
			heading: 'Senses Grant Selection',
			selected: data?.selected ?? [],
		};
	}

	override requiresConfig() {
		return !!this.config.senses.options.length;
	}

	override async configureGrant() {
		const dialogData = {
			grantId: this._id,
			grantType: 'senses',
		};

		super.configureGrant('Configure Senses Grant', dialogData, this.#configComponent, {
			width: 400,
		});
	}

	static override migrateData(source: any, options: any) {
		options ??= {};
		source = super.migrateData(source, options);

		if (source.config) return source;
		source.config ??= {};
		source.config.senses = source.senses;
		source.config.bonus = source.bonus;
		source.config.context = source.context;
		source.config.unit = source.unit;

		return source;
	}
}

export { SensesGrant };
