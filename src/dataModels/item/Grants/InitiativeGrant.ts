import NumericalGrantConfig from '#view/components/grants/NumericalGrantConfig.svelte';
import { initiativeBonusContextGrant } from '../../actor/Contexts.ts';
import BaseGrant from './BaseGrant.ts';

export default class InitiativeGrant extends BaseGrant {
	#configComponent = NumericalGrantConfig;

	#type = 'initiative';

	static override defineSchema() {
		const { fields } = foundry.data;

		return this.mergeSchema(super.defineSchema(), {
			grantType: new fields.StringField({
				required: true,
				initial: 'initiative',
			}),
			bonus: new fields.StringField({ required: true, initial: '' }),
			context: new fields.SchemaField(initiativeBonusContextGrant()),
			label: new fields.StringField({
				required: true,
				initial: 'New Initiative Grant',
			}),
		});
	}

	override getApplyData(actor: any): any {
		if (!actor) return {};

		// Construct bonus
		const bonusId = foundry.utils.randomID();
		const bonus = {
			context: this.context,
			formula: this.bonus,
			label: this.label || this.parent?.name || 'Initiative Grant',
			default: this.context.default ?? true,
			img: this.img || this?.parent?.img,
		};

		delete bonus.context.default;

		const grantData = {
			itemUuid: this.parent.uuid,
			grantId: this._id,
			bonusId,
			type: 'initiative',
			grantType: 'bonus',
			level: this.level,
		};

		return {
			[`system.bonuses.initiative.${bonusId}`]: bonus,
			'system.grants': {
				...actor.system.grants,
				[this._id]: grantData,
			},
		};
	}

	override getSelectionComponent() {
		return null;
	}

	override getSelectionComponentProps() {
		return null;
	}

	override requiresConfig() {
		return false;
	}

	override async configureGrant() {
		const dialogData = {
			document: this?.parent,
			grantId: this._id,
			grantType: this.#type,
		};

		super.configureGrant('Configure Initiative Grant', dialogData, this.#configComponent, {
			width: 500,
		});
	}
}
