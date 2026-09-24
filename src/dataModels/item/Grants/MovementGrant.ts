import NumericalGrantConfig from '#view/components/grants/NumericalGrantConfig.svelte';
import NumericalGrantSelectionDialog from '#view/components/grants/NumericalGrantSelectionDialog.svelte';
import { movementBonusContextGrant } from '../../actor/Contexts.ts';
import { BaseGrant } from './BaseGrant.ts';
import { bonusGrantSchema } from './common.ts';

import fields = foundry.data.fields;

// ======================================================
// Schema
// ======================================================
const schema = () => ({
	// Config
	config: new fields.SchemaField({
		movementTypes: new fields.SchemaField({
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
		context: new fields.SchemaField(movementBonusContextGrant()),
	}),

	// Applied
	applied: new fields.SchemaField(bonusGrantSchema(), { required: true, nullable: false }),

	// Deprecations
	/** @deprecated */
	movementTypes: new fields.SchemaField({
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
	/** @deprecated */
	unit: new fields.StringField({ required: true, nullable: false, initial: 'feet' }),
	/** @deprecated */
	bonus: new fields.StringField({ required: true, nullable: false, initial: '' }),
	/** @deprecated */
	context: new fields.SchemaField(movementBonusContextGrant()),

	// Overrides
	name: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'New Movement Bonus Grant',
	}),
	type: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		initial: 'movement',
	}),
});

// ======================================================
//                      NameSpace
// ======================================================
declare namespace MovementGrant {
	type Schema = BaseGrant.Schema & ReturnType<typeof schema>;
}

class MovementGrant extends BaseGrant<MovementGrant.Schema> {
	#component = NumericalGrantSelectionDialog;

	#configComponent = NumericalGrantConfig;

	#type = 'movement';

	static override type = 'movement';

	static override defineSchema(): MovementGrant.Schema {
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
				movementTypes: data?.selected ?? this.movementTypes.base ?? [],
				...this.context,
			},
			formula: this.bonus,
			unit: this.unit || 'feet',
			label: this.label || this.parent?.name || 'Movement Grant',
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
			[`system.bonuses.movement.${bonusId}`]: bonus,
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
			base: this.movementTypes.base ?? [],
			bonus: this.bonus,
			choices: this.movementTypes.options ?? [],
			configObject: CONFIG.A5E.movementAbbreviations,
			count: this.movementTypes.total,
			unit: this.unit,
			heading: 'Movement Grant Selection',
			selected: data?.selected ?? [],
		};
	}

	override requiresConfig() {
		return this.movementTypes.options.length;
	}

	override async configureGrant() {
		const dialogData = {
			document: this?.parent,
			grantId: this._id,
			grantType: 'movement',
		};

		super.configureGrant('Configure Movement Grant', dialogData, this.#configComponent, {
			width: 400,
		});
	}
}

export { MovementGrant };
