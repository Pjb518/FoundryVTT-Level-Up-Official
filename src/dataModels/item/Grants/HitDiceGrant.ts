import NumericalGrantConfig from '#view/components/grants/NumericalGrantConfig.svelte';
import { hitDiceBonusContextGrant } from '../../actor/Contexts.ts';
import BaseGrant from './BaseGrant.ts';

export default class HitDiceGrant extends BaseGrant {
	#configComponent = NumericalGrantConfig;

	#type = 'hitDice';

	static override defineSchema() {
		const { fields } = foundry.data;

		return this.mergeSchema(super.defineSchema(), {
			grantType: new fields.StringField({ required: true, initial: 'hitDice' }),
			bonus: new fields.StringField({ required: true, initial: '' }),
			context: new fields.SchemaField(hitDiceBonusContextGrant()),
			bonusType: new fields.StringField({
				required: true,
				initial: 'add',
        choices: ['add', 'override', 'modifier'],
			}),
			label: new fields.StringField({
				required: true,
				initial: 'New Hit Dice Grant',
			}),
		});
	}

	override getApplyData(actor: typeof Actor): any {
		if (!actor) return {};

		const bonusId = foundry.utils.randomID();
		const bonus = {
			context: { ...this.context },
			formula: this.bonus,
			label: this.label || this.parent?.name || 'Hit Dice Grant',
			default: this.context.default ?? true,
			img: this.img || this?.parent?.img,
      bonusType: this.bonusType,
		};

		delete bonus.context.default;

		const grantData = {
			itemUuid: this.parent.uuid,
			grantId: this._id,
			bonusId,
			type: 'hitDice',
			grantType: 'bonus',
			level: this.level,
		};

		return {
			[`system.bonuses.hitDice.${bonusId}`]: bonus,
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
			document: this.parent,
			grantId: this._id,
			grantType: this.#type,
		};

		super.configureGrant('Configure Hit Dice Grant', dialogData, this.#configComponent, {
			width: 400,
		});
	}
}
