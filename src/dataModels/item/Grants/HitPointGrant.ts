import NumericalGrantConfig from '#view/components/grants/NumericalGrantConfig.svelte';
import { hitPointsBonusContextGrant } from '../../actor/Contexts.ts';
import BaseGrant from './BaseGrant.ts';
import { bonusGrantSchema } from './common.ts';

import fields = foundry.data.fields;

// ======================================================
// Schema
// ======================================================
const schema = () => ({
	// Config
	config: new fields.SchemaField({
		bonus: new fields.StringField({ required: true, nullable: false, initial: '' }),
		context: new fields.SchemaField(hitPointsBonusContextGrant()),
	}),
	// Applied
	applied: new fields.SchemaField(bonusGrantSchema(), { required: true, nullable: false }),

	// Deprecations
	/** @deprecated */
	bonus: new fields.StringField({ required: true, nullable: false, initial: '' }),
	/** @deprecated */
	context: new fields.SchemaField(hitPointsBonusContextGrant()),

	// Overrides
	name: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'New Hit Points Grant',
	}),
	type: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		initial: 'hitPoint',
	}),
});

// ======================================================
//                      NameSpace
// ======================================================
declare namespace HitPointGrant {
	type Schema = BaseGrant.Schema & ReturnType<typeof schema>;
}

class HitPointGrant extends BaseGrant<HitPointGrant.Schema> {
	#configComponent = NumericalGrantConfig;

	#type = 'hitPoint';

	static override type = 'hitPoint';

	static override defineSchema(): HitPointGrant.Schema {
		// @ts-expect-error
		return {
			...super.defineSchema(),
			...schema(),
		};
	}

	override getApplyData(actor: Character, _data: any = {}) {
		if (!actor) return {};

		const bonusId = foundry.utils.randomID();
		const bonus = {
			context: { ...this.config.context },
			formula: this.config.bonus,
			label: this.name || this.parent?.name || 'HitPoint Grant',
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
			[`system.bonuses.hitPoint.${bonusId}`]: bonus,
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
		return {};
	}

	override requiresConfig(): boolean {
		return false;
	}

	override async configureGrant(): Promise<any> {
		const dialogData = {
			document: this?.parent,
			grantId: this._id,
			grantType: this.#type,
		};

		super.configureGrant('Configure Hit Points Grant', dialogData, this.#configComponent, {
			width: 400,
		});
	}
}

export { HitPointGrant };
