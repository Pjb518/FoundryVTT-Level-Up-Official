import NumericalGrantConfig from '#view/components/grants/NumericalGrantConfig.svelte';
import NumericalGrantSelectionDialog from '#view/components/grants/NumericalGrantSelectionDialog.svelte';
import { abilitiesBonusContextGrant } from '../../actor/Contexts.ts';
import { BaseGrant, type baseSchema } from './BaseGrant.ts';

import fields = foundry.data.fields;
import DataModel = foundry.abstract.DataModel;

// ======================================================
// Schema
// ======================================================
const schema = () => ({
	// Config
	config: new fields.SchemaField({
		abilities: new fields.SchemaField({
			base: new fields.ArrayField(
				new fields.StringField({ required: true, nullable: false, initial: '' }),
				{ required: true, nullable: false },
			),
			options: new fields.ArrayField(
				new fields.StringField({ required: true, nullable: false, initial: '' }),
				{ required: true, initial: [] },
			),
			total: new fields.NumberField({ requored: true, nullable: false, initial: 0 }),
		}),
		bonus: new fields.StringField({ required: true, nullable: false, initial: '' }),
		context: new fields.SchemaField(abilitiesBonusContextGrant()),
	}),
	// Applied
	applied: new fields.SchemaField({}, { required: true, nullable: false }),

	// Deprecations
	/** @deprecated */
	abilities: new fields.SchemaField({
		base: new fields.ArrayField(
			new fields.StringField({ required: true, nullable: false, initial: '' }),
			{ required: true, nullable: false },
		),
		options: new fields.ArrayField(
			new fields.StringField({ required: true, nullable: false, initial: '' }),
			{ required: true, initial: [] },
		),
		total: new fields.NumberField({ requored: true, nullable: false, initial: 0 }),
	}),
	/** @deprecated */
	bonus: new fields.StringField({ required: true, nullable: false, initial: '' }),
	/** @deprecated */
	context: new fields.SchemaField(abilitiesBonusContextGrant()),

	// Overrides
	name: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'New Ability Bonus Grant',
	}),
	type: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		initial: 'ability',
	}),
});

// ======================================================
//                      NameSpace
// ======================================================
declare namespace AbilityGrant {
	type Schema = BaseGrant.Schema & ReturnType<typeof schema>;
}

class AbilityGrant extends BaseGrant<AbilityGrant.Schema> {
	#component = NumericalGrantSelectionDialog;

	#configComponent = NumericalGrantConfig;

	#type = 'ability';

	static override defineSchema(): AbilityGrant.Schema {
		return {
			...super.defineSchema(),
			...schema(),
		};
	}

	override getApplyData(actor: any, data: any): any {
		if (!actor) return {};
		const selected = data?.selected ?? this.abilities.base ?? [];

		// Construct bonus
		const bonusId = foundry.utils.randomID();
		const bonus = {
			context: {
				abilities: selected,
				...this.context,
			},
			formula: this.bonus,
			label: this.label || this.parent?.name || 'Ability Grant',
			default: this.context.default ?? true,
			img: this.img || this?.parent?.img,
		};

		delete bonus.context.default;

		const grantData = {
			itemUuid: this.parent.uuid,
			grantId: this._id,
			bonusId,
			type: 'abilities',
			grantType: 'bonus',
			level: this.level,
		};

		return {
			[`system.bonuses.abilities.${bonusId}`]: bonus,
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
			base: this.abilities.base,
			bonus: this.bonus,
			choices: this.abilities.options,
			configObject: CONFIG.A5E.abilities,
			count: this.abilities.total,
			heading: 'Ability Grant Selection',
			selected: data?.selected ?? [],
		};
	}

	override requiresConfig() {
		return this.abilities.options.length;
	}

	override async configureGrant() {
		const dialogData = {
			document: this?.parent,
			grantId: this._id,
			grantType: 'abilities',
		};

		super.configureGrant('Configure Ability Grant', dialogData, this.#configComponent, {
			width: 400,
		});
	}
}

export { AbilityGrant };
