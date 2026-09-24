import NumericalGrantConfig from '#view/components/grants/NumericalGrantConfig.svelte';
import NumericalGrantSelectionDialog from '#view/components/grants/NumericalGrantSelectionDialog.svelte';
import { abilitiesBonusContextGrant } from '../../actor/Contexts.ts';
import { BaseGrant } from './BaseGrant.ts';
import { bonusGrantSchema } from './common.ts';

import fields = foundry.data.fields;

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
			total: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
		}),
		bonus: new fields.StringField({ required: true, nullable: false, initial: '' }),
		context: new fields.SchemaField(abilitiesBonusContextGrant()),
	}),

	// Applied
	applied: new fields.SchemaField(bonusGrantSchema(), { required: true, nullable: false }),

	// Deprecations
	/** @deprecated */
	abilities: new fields.SchemaField({
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

	static override type = 'ability';

	static override defineSchema(): AbilityGrant.Schema {
		// @ts-expect-error
		return {
			...super.defineSchema(),
			...schema(),
		};
	}

	override getApplyData(actor: Character, data: any): any {
		if (!actor) return {};
		const selected = data?.selected ?? this.config.abilities.base ?? [];

		// Construct bonus
		const bonusId = foundry.utils.randomID();
		const bonus = {
			context: {
				abilities: selected,
				...this.config.context,
			},
			formula: this.config.bonus,
			label: this.name || this.parent?.name || 'Ability Grant',
			default: this.config.context.default ?? true,
			img: this.img || this?.parent?.img,
		};

		// Why is this here?
		// delete bonus.context.default;

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
			base: this.config.abilities.base,
			bonus: this.config.bonus,
			choices: this.config.abilities.options,
			configObject: CONFIG.A5E.abilities,
			count: this.config.abilities.total,
			heading: 'Ability Grant Selection',
			selected: data?.selected ?? [],
		};
	}

	override requiresConfig() {
		return !!this.config.abilities.options.length;
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
