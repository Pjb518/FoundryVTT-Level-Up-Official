import RollOverrideGrantConfig from '#view/components/grants/RollOverrideGrantConfig.svelte';
import RollOverrideGrantSelectionDialog from '#view/components/grants/RollOverrideGrantSelectionDialog.svelte';
import { BaseGrant } from './BaseGrant.ts';
import { rollOverrideGrantSchema } from './common.ts';

import fields = foundry.data.fields;

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
		rollMode: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
		rollOverrideType: new fields.StringField({
			required: true,
			nullable: false,
			initial: 'abilityCheck',
		}),
	}),

	// Applied
	applied: new fields.SchemaField(rollOverrideGrantSchema(), { required: true, nullable: false }),

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
	rollMode: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
	/** @deprecated */
	rollOverrideType: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'abilityCheck',
	}),

	// Overrides
	name: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'New Roll Mode Grant',
	}),
	type: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		initial: 'rollOverride',
	}),
});

// ======================================================
//                      NameSpace
// ======================================================
declare namespace RollOverrideGrant {
	type Schema = BaseGrant.Schema & ReturnType<typeof schema>;
}

class RollOverrideGrant extends BaseGrant<RollOverrideGrant.Schema> {
	#component = RollOverrideGrantSelectionDialog;

	#configComponent = RollOverrideGrantConfig;

	#type = 'rollOverride';

	static override type = 'rollOverride';

	static override defineSchema(): RollOverrideGrant.Schema {
		// @ts-expect-error
		return {
			...super.defineSchema(),
			...schema(),
		};
	}

	override getApplyData(actor: Character, data: any) {
		if (!actor) return {};
		const selected: string[] = data?.selected ?? this.config.keys.base ?? [];
		const count: number = this.config.keys.total;

		// Construct appliedData
		const appliedData: typeof this.applied = {
			selected,
			total: count,
			overrideType: this.config.rollOverrideType,
			rollMode: this.config.rollMode,
			grantType: this.#type,
			level: this.level,
			isApplied: true,
		};

		this.item.update({
			[`system.grants.${this.id}.applied`]: appliedData,
		});

		return {};
	}

	override getSelectionComponent() {
		return this.#component;
	}

	override getSelectionComponentProps(data: any) {
		return {
			base: this.config.keys.base ?? [],
			choices: this.config.keys.options ?? [],
			count: this.config.keys.total,
			rollOverrideType: this.config.rollOverrideType,
			selected: data?.selected ?? [],
		};
	}

	override requiresConfig(): boolean {
		return !!this.config.keys.options.length;
	}

	override async configureGrant() {
		const dialogData = {
			document: this.item,
			grantId: this.id,
			grantType: this.#type,
		};

		super.configureGrant('Configure Roll Override Grant', dialogData, this.#configComponent, {
			width: 400,
		});
	}

	static override migrateData(source: any, options: any) {
		options ??= {};
		source = super.migrateData(source, options);

		if (source.config) return source;
		source.config ??= {};
		source.config.keys = source.keys;
		source.config.rollMode = source.rollMode;
		source.config.rollOverrideType = source.rollOverrideType;

		return source;
	}
}

export { RollOverrideGrant };
