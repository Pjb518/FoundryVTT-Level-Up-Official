import NumericalGrantConfig from '#view/components/grants/NumericalGrantConfig.svelte';
import { damageBonusContextGrant } from '../../actor/Contexts.ts';
import { BaseGrant } from './BaseGrant.ts';
import { bonusGrantSchema } from './common.ts';

import fields = foundry.data.fields;

// ======================================================
// Schema
// ======================================================
const schema = () => ({
	// Config
	config: new fields.SchemaField({
		damageType: new fields.StringField({ required: true, nullable: false, initial: '' }),
		bonus: new fields.StringField({ required: true, nullable: false, initial: '' }),
		context: new fields.SchemaField(damageBonusContextGrant()),
	}),
	// Applied
	applied: new fields.SchemaField(bonusGrantSchema(), { required: true, nullable: false }),

	// Deprecations
	/** @deprecated */
	damageType: new fields.StringField({ required: true, nullable: false, initial: '' }),
	/** @deprecated */
	bonus: new fields.StringField({ required: true, nullable: false, initial: '' }),
	/** @deprecated */
	context: new fields.SchemaField(damageBonusContextGrant()),

	// Overrides
	name: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'New Damage Grant',
	}),
	type: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		initial: 'damage',
	}),
});

// ======================================================
//                      NameSpace
// ======================================================
declare namespace DamageGrant {
	type Schema = BaseGrant.Schema & ReturnType<typeof schema>;
}

class DamageGrant extends BaseGrant<DamageGrant.Schema> {
	#configComponent = NumericalGrantConfig;

	#type = 'damage';

	static override type = 'damage';

	static override defineSchema(): DamageGrant.Schema {
		// @ts-expect-error
		return {
			...super.defineSchema(),
			...schema(),
		};
	}

	override getApplyData(actor: Character): any {
		if (!actor) return {};

		const bonusId = foundry.utils.randomID();
		const bonus = {
			context: this.config.context,
			formula: this.config.bonus,
			label: this.name || this.parent?.name || 'Damage Grant',
			default: this.config.context.default ?? true,
			img: this.img || this?.parent?.img,
		};

		delete bonus.context.default;

		const grantData = {
			itemUuid: this.parent.uuid,
			grantId: this._id,
			bonusId,
			type: 'damage',
			grantType: 'bonus',
			level: this.level,
		};

		return {
			[`system.bonuses.damage.${bonusId}`]: bonus,
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

		super.configureGrant('Configure Damage Grant', dialogData, this.#configComponent, {
			width: 500,
		});
	}

	static override migrateData(source: any, options: any) {
		options ??= {};
		source = super.migrateData(source, options);

		if (source.config) return source;
		source.config ??= {};
		source.config.damageType = source.damageType;
		source.config.bonus = source.bonus;
		source.config.context = source.context;

		return source;
	}
}

export { DamageGrant };
