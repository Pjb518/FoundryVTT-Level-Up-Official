import NumericalGrantConfig from '#view/components/grants/NumericalGrantConfig.svelte';
import { initiativeBonusContext, initiativeBonusContextGrant } from '../../actor/Contexts.ts';
import { BaseGrant } from './BaseGrant.ts';
import { bonusGrantSchema } from './common.ts';

import fields = foundry.data.fields;

// ======================================================
// Schema
// ======================================================
const schema = () => ({
	// Config
	config: new fields.SchemaField({
		bonus: new fields.StringField({ required: true, nullable: false, initial: '' }),
		context: new fields.SchemaField(initiativeBonusContext()),
	}),
	// Applied
	applied: new fields.SchemaField(bonusGrantSchema(), { required: true, nullable: false }),

	// Deprecations
	/** @deprecated */
	bonus: new fields.StringField({ required: true, nullable: false, initial: '' }),
	/** @deprecated */
	context: new fields.SchemaField(initiativeBonusContextGrant()),

	// Overrides
	name: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'New Initiative Bonus Grant',
	}),
	type: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		initial: 'initiative',
	}),
});

// ======================================================
//                      NameSpace
// ======================================================
declare namespace InitiativeGrant {
	type Schema = BaseGrant.Schema & ReturnType<typeof schema>;
}

class InitiativeGrant extends BaseGrant<InitiativeGrant.Schema> {
	#configComponent = NumericalGrantConfig;

	#type = 'initiative';

	static override type = 'initiative';

	static override defineSchema(): InitiativeGrant.Schema {
		// @ts-expect-error
		return {
			...super.defineSchema(),
			...schema(),
		};
	}

	override getApplyData(actor: Character): any {
		if (!actor) return {};

		// Construct bonus
		const bonusId = foundry.utils.randomID();
		const bonus = {
			context: this.config.context,
			formula: this.config.bonus,
			label: this.name || this.parent?.name || 'Initiative Grant',
			default: this.config.context.default ?? true,
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

export { InitiativeGrant };
