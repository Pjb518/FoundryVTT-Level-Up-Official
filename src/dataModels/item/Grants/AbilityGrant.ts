import BaseGrant from './BaseGrant';

import NumericalGrantConfig from '../../../apps/components/grants/NumericalGrantConfig.svelte';
import NumericalGrantSelectionDialog from '../../../apps/components/grants/NumericalGrantSelectionDialog.svelte';

import { getAbilitiesBonusContext } from '../../actor/Contexts';

export default class AbilityGrant extends BaseGrant {
	#component = NumericalGrantSelectionDialog;

	#configComponent = NumericalGrantConfig;

	#type = 'ability';

	static override defineSchema() {
		const { fields } = foundry.data;

		return this.mergeSchema(super.defineSchema(), {
			grantType: new fields.StringField({ required: true, initial: 'ability' }),
			abilities: new fields.SchemaField({
				base: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
					required: true,
					initial: [],
				}),
				options: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
					required: true,
					initial: [],
				}),
				total: new fields.NumberField({ required: true, initial: 0, integer: true }),
			}),
			bonus: new fields.StringField({ required: true, initial: '' }),
			context: new fields.SchemaField(getAbilitiesBonusContext('grant')),
			label: new fields.StringField({ required: true, initial: 'New Ability Grant' }),
		});
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
