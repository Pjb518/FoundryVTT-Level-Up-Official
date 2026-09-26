import ExpertiseDiceGrantConfig from '#view/components/grants/ExpertiseDiceGrantConfig.svelte';
import ExpertiseDiceSelectionDialog from '#view/components/grants/ExpertiseDiceSelectionDialog.svelte';
import { BaseGrant } from './BaseGrant.ts';

import fields = foundry.data.fields;

import { expertiseDiceGrantSchema } from './common.ts';

// ======================================================
// Schema
// ======================================================
const schema = () => ({
	// Config
	config: new fields.SchemaField({
		keys: new fields.SchemaField({
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
		expertiseCount: new fields.NumberField({ required: true, nullable: false, initial: 1 }),
		expertiseType: new fields.StringField({
			required: false,
			nullable: false,
			initial: 'abilityCheck',
		}),
	}),

	// Applied
	applied: new fields.SchemaField(expertiseDiceGrantSchema(), { required: true, nullable: false }),

	// Deprecations
	/** @deprecated */
	keys: new fields.SchemaField({
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
	expertiseCount: new fields.NumberField({ required: true, nullable: false, initial: 1 }),
	/** @deprecated */
	expertiseType: new fields.StringField({
		required: false,
		nullable: false,
		initial: 'abilityCheck',
	}),

	// Overrides
	name: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'New Expertise Dice Grant',
	}),
	type: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		initial: 'expertiseDice',
	}),
});

// ======================================================
//                      NameSpace
// ======================================================
declare namespace ExpertiseDiceGrant {
	type Schema = BaseGrant.Schema & ReturnType<typeof schema>;
}

class ExpertiseDiceGrant extends BaseGrant<ExpertiseDiceGrant.Schema> {
	#component = ExpertiseDiceSelectionDialog;

	#configComponent = ExpertiseDiceGrantConfig;

	#type = 'expertiseDice';

	static override type = 'expertiseDice';

	static override defineSchema(): ExpertiseDiceGrant.Schema {
		// @ts-expect-error
		return {
			...super.defineSchema(),
			...schema(),
		};
	}

	override getApplyData(actor: any, data: any) {
		if (!actor) return {};
		const selected: string[] = data?.selected ?? this.config.keys.base ?? [];
		const count: number = this.config.keys.total;

		const updates: Record<string, any> = {};

		// Construct grant
		const grantData = {
			expertiseDiceData: {
				keys: selected,
				total: count,
				expertiseType: this.config.expertiseType,
				expertiseCount: this.config.expertiseCount,
			},
			itemUuid: this.item.uuid,
			grantId: this._id,
			grantType: this.#type,
			level: this.level,
		};

		updates['system.grants'] = {
			...actor.system.grants,
			[this._id]: grantData,
		};

		return updates;
	}

	override getSelectionComponent() {
		return this.#component;
	}

	override getSelectionComponentProps(data: any) {
		return {
			base: this.config.keys.base ?? [],
			choices: this.config.keys.options,
			count: this.config.keys.total,
			expertiseType: this.config.expertiseType,
			selected: data?.selected ?? [],
		};
	}

	override requiresConfig() {
		return !!this.config.keys.options.length;
	}

	override async configureGrant() {
		const dialogData = {
			document: this.item,
			grantId: this.id,
			grantType: 'expertiseDice',
		};

		super.configureGrant('Configure Expertise Grant', dialogData, this.#configComponent, {
			width: 400,
		});
	}

	static override migrateData(source: any, options: any) {
		options ??= {};
		source = super.migrateData(source, options);

		if (source.config) return source;
		source.config ??= {};
		source.config.keys = source.keys;
		source.config.expertiseCount = source.expertiseCount;
		source.config.expertiseType = source.expertiseType;

		return source;
	}
}

export { ExpertiseDiceGrant };
