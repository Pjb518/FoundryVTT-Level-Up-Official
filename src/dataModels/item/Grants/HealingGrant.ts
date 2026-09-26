import NumericalGrantConfig from '#view/components/grants/NumericalGrantConfig.svelte';
import { healingBonusContextGrant } from '../../actor/Contexts.ts';
import { BaseGrant } from './BaseGrant.ts';
import { bonusGrantSchema } from './common.ts';

import fields = foundry.data.fields;

// ======================================================
// Schema
// ======================================================
const schema = () => ({
	// Config
	config: new fields.SchemaField({
		healingType: new fields.StringField({ required: true, nullable: false, initial: 'healing' }),
		bonus: new fields.StringField({ required: true, nullable: false, initial: '' }),
		context: new fields.SchemaField(healingBonusContextGrant()),
	}),
	// Applied
	applied: new fields.SchemaField(bonusGrantSchema(), { required: true, nullable: false }),

	// Deprecations
	/** @deprecated */
	healingType: new fields.StringField({ required: true, nullable: false, initial: 'healing' }),
	/** @deprecated */
	bonus: new fields.StringField({ required: true, nullable: false, initial: '' }),
	/** @deprecated */
	context: new fields.SchemaField(healingBonusContextGrant()),

	// Overrides
	name: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'New Healing Grant',
	}),
	type: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		initial: 'healing',
	}),
});

// ======================================================
//                      NameSpace
// ======================================================
declare namespace HealingGrant {
	type Schema = BaseGrant.Schema & ReturnType<typeof schema>;
}

class HealingGrant extends BaseGrant<HealingGrant.Schema> {
	#configComponent = NumericalGrantConfig;

	#type = 'healing';

	static override type = 'healing';

	static override defineSchema(): HealingGrant.Schema {
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
			label: this.name || this.item?.name || 'Healing Grant',
			default: this.config.context.default ?? true,
			img: this.img || this?.item?.img,
		};

		const appliedData: typeof this.applied = {
			bonusId,
			bonusType: 'healing',
			grantType: 'bonus',
			level: this.level,
			isApplied: true,
		};

		this.item.update({
			[`system.grants.${this.id}.applied`]: appliedData,
		});

		return {
			[`system.bonuses.abilities.${bonusId}`]: bonus,
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
			document: this.item,
			grantId: this.id,
			grantType: this.#type,
		};

		super.configureGrant('Configure Healing Grant', dialogData, this.#configComponent, {
			width: 400,
		});
	}

	static override migrateData(source: any, options: any) {
		options ??= {};
		source = super.migrateData(source, options);

		if (source.config) return source;
		source.config ??= {};
		source.config.healingType = source.healingType;
		source.config.bonus = source.bonus;
		source.config.context = source.context;

		return source;
	}
}

export { HealingGrant };
