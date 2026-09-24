import RollOverrideGrantConfig from '#view/components/grants/RollOverrideGrantConfig.svelte';
import RollOverrideGrantSelectionDialog from '#view/components/grants/RollOverrideGrantSelectionDialog.svelte';
import { BaseGrant } from './BaseGrant.ts';

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
	applied: new fields.SchemaField({}, { required: true, nullable: false }),

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

	override getApplyData(actor: any, data: any) {
		if (!actor) return {};
		const selected: string[] = data?.selected ?? this.keys.base ?? [];
		const count: number = this.keys.total;

		const updates: Record<string, any> = {};

		// Construct grant
		const grantData = {
			rollOverrideData: {
				keys: selected,
				total: count,
				rollOverrideType: this.rollOverrideType,
				rollMode: this.rollMode,
			},
			itemUuid: this.parent.uuid,
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
			base: this.keys.base ?? [],
			choices: this.keys.options ?? [],
			count: this.keys.total,
			rollOverrideType: this.rollOverrideType,
			selected: data?.selected ?? [],
		};
	}

	override requiresConfig(): boolean {
		return !!this.keys.options.length;
	}

	override async configureGrant() {
		const dialogData = {
			document: this?.parent,
			grantId: this._id,
			grantType: this.#type,
		};

		super.configureGrant('Configure Roll Override Grant', dialogData, this.#configComponent, {
			width: 400,
		});
	}
}

export { RollOverrideGrant };
