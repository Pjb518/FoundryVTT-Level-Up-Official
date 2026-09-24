import NumericalGrantConfig from '#view/components/grants/NumericalGrantConfig.svelte';
import NumericalGrantSelectionDialog from '#view/components/grants/NumericalGrantSelectionDialog.svelte';
import { sensesBonusContextGrant } from '../../actor/Contexts.ts';
import { BaseGrant } from './BaseGrant.ts';

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
	applied: new fields.SchemaField({}, { required: true, nullable: false }),

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

	override getApplyData(actor: any, data: any) {
		if (!actor) return {};

		const bonusId = foundry.utils.randomID();
		const bonus = {
			context: {
				senses: data?.selected ?? this.senses.base ?? [],
				...this.context,
			},
			formula: this.bonus,
			unit: this.unit || 'feet',
			label: this.label || this.parent?.name || 'Senses Grant',
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
			base: this.senses.base ?? [],
			bonus: this.bonus,
			choices: this.senses.options ?? [],
			configObject: CONFIG.A5E.senses,
			count: this.senses.total,
			unit: this.unit,
			heading: 'Senses Grant Selection',
			selected: data?.selected ?? [],
		};
	}

	override requiresConfig() {
		return this.senses.options.length;
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
}

export { SensesGrant };
