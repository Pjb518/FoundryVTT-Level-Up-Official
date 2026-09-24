import prepareTraitGrantConfigObject from '#utils/prepareTraitGrantConfigObject.ts';
import TraitGrantConfig from '#view/components/grants/TraitGrantConfig.svelte';
import TraitGrantSelectionDialog from '#view/components/grants/TraitGrantSelectionDialog.svelte';
import { BaseGrant } from './BaseGrant.ts';
import { traitGrantSchema } from './common.ts';

import fields = foundry.data.fields;

// ======================================================
// Schema
// ======================================================
const schema = () => ({
	// Config
	config: new fields.SchemaField({
		traits: new fields.SchemaField({
			base: new fields.ArrayField(
				new fields.StringField({ required: true, nullable: false, initial: '' }),
				{ required: true, nullable: false },
			),
			options: new fields.ArrayField(
				new fields.StringField({ required: true, nullable: false, initial: '' }),
				{ required: true, initial: [] },
			),
			total: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
			traitType: new fields.StringField({
				required: true,
				nullable: false,
				intitial: 'conditionImmunities',
			}),
		}),
	}),

	// Applied
	applied: new fields.SchemaField(traitGrantSchema(), { required: true, nullable: false }),

	// Deprecations
	/** @deprecated */
	traits: new fields.SchemaField({
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
	traitType: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'conditionImmunities',
	}),

	// Overrides
	name: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'New Trait Grant',
	}),
	type: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		initial: 'trait',
	}),
});

// ======================================================
//                      NameSpace
// ======================================================
declare namespace TraitGrant {
	type Schema = BaseGrant.Schema & ReturnType<typeof schema>;
}

class TraitGrant extends BaseGrant<TraitGrant.Schema> {
	#component = TraitGrantSelectionDialog;

	#configComponent = TraitGrantConfig;

	#type = 'trait';

	static override type = 'trait';

	static override defineSchema(): TraitGrant.Schema {
		// @ts-expect-error
		return {
			...super.defineSchema(),
			...schema(),
		};
	}

	override getApplyData(actor: any, data: any) {
		if (!actor) return {};
		const selected: string[] = data?.selected ?? this.traits.base ?? [];
		const count: number = this.traits.total;

		// Construct grant
		const grantData = {
			traitData: {
				traits: selected,
				total: count,
				traitType: this.traits.traitType,
			},
			itemUuid: this.parent.uuid,
			grantId: this._id,
			grantType: this.#type,
			level: this.level,
		};

		// Construct trait update
		const configObject = prepareTraitGrantConfigObject();
		const { propertyKey } = configObject[this.traits.traitType] ?? {};
		if (!propertyKey) return {};
		if (!selected.length) return {};

		let traits: Set<string>;

		if (this.traits.traitType === 'size') {
			traits = new Set([selected[0]]);
		} else {
			traits = new Set([
				...selected,
				...((foundry.utils.getProperty(actor, propertyKey) as string[]) ?? []),
			]);
		}

		return {
			[propertyKey]: [...traits],
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
			base: this.traits.base ?? [],
			choices: this.traits.options,
			count: this.traits.total,
			traitType: this.traits.traitType,
			selected: data?.selected ?? [],
		};
	}

	override requiresConfig(): boolean {
		return this.traits.options.length;
	}

	override async configureGrant() {
		const dialogData = {
			document: this.parent,
			grantId: this._id,
		};

		super.configureGrant('Configure Trait Grant', dialogData, this.#configComponent, {
			width: 400,
		});
	}
}

export { TraitGrant };
