import ItemGrantConfig from '#view/components/grants/ItemGrantConfig.svelte';
import ItemGrantSelectionDialog from '#view/components/grants/ItemGrantSelectionDialog.svelte';
import { BaseGrant } from './BaseGrant.ts';
import { documentGrantSchema } from './common.ts';

import fields = foundry.data.fields;

// ======================================================
// Schema
// ======================================================
const schema = () => ({
	// Config
	config: new fields.SchemaField({
		items: new fields.SchemaField({
			base: new fields.ArrayField(
				new fields.SchemaField({
					uuid: new fields.StringField({ required: true, nullable: false, initial: '' }),
					quantityOverride: new fields.NumberField({
						required: true,
						nullable: false,
						initial: 0,
					}),
				}),
				{ required: true, default: [] },
			),
			options: new fields.ArrayField(
				new fields.SchemaField({
					uuid: new fields.StringField({ required: true, initial: '', nullable: false }),
					quantityOverride: new fields.NumberField({
						required: true,
						nullable: false,
						initial: 0,
					}),
				}),
			),
			total: new fields.NumberField({
				required: true,
				nullable: false,
				initial: 0,
			}),
		}),
	}),
	// Applied
	applied: new fields.SchemaField(documentGrantSchema(), { required: true, nullable: false }),

	// Deprecations
	/** @deprecated */
	items: new fields.SchemaField({
		base: new fields.ArrayField(
			new fields.SchemaField({
				uuid: new fields.StringField({ required: true, nullable: false, initial: '' }),
				quantityOverride: new fields.NumberField({
					required: true,
					nullable: false,
					initial: 0,
				}),
			}),
			{ required: true, default: [] },
		),
		options: new fields.ArrayField(
			new fields.SchemaField({
				uuid: new fields.StringField({ required: true, initial: '', nullable: false }),
				quantityOverride: new fields.NumberField({
					required: true,
					nullable: false,
					initial: 0,
				}),
			}),
		),
		total: new fields.NumberField({
			required: true,
			nullable: false,
			initial: 0,
		}),
	}),

	// Overrides
	name: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'New Item Bonus Grant',
	}),
	type: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		initial: 'item',
	}),
});

// ======================================================
//                      NameSpace
// ======================================================
declare namespace ItemGrant {
	type Schema = BaseGrant.Schema & ReturnType<typeof schema>;
}

class ItemGrant extends BaseGrant<ItemGrant.Schema> {
	#component = ItemGrantSelectionDialog;

	#configComponent = ItemGrantConfig;

	#type = 'item';

	static override type = 'item';

	static override defineSchema(): ItemGrant.Schema {
		// @ts-expect-error
		return {
			...super.defineSchema(),
			...schema(),
		};
	}

	override getApplyData(actor: Character, data: any): any {
		if (!actor) return {};

		const grantData = {
			itemUuid: this.parent.uuid,
			grantId: this._id,
			grantType: this.#type,
			level: this.level,
		};

		return {
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
			base: this.config.items.base.map(({ uuid }) => uuid) ?? [],
			choices: this.config.items.options.map(({ uuid }) => uuid) ?? [],
			count: this.config.items.total,
			selected: data?.uuids ?? [],
		};
	}

	override requiresConfig() {
		return !!this.config.items.options.length;
	}

	override async configureGrant() {
		const dialogData = {
			document: this?.parent,
			grantId: this._id,
			grantType: this.#type,
		};

		super.configureGrant('Configure Item Grant', dialogData, this.#configComponent, { width: 400 });
	}

	static override migrateData(source: any, options: any) {
		options ??= {};
		console.log(source, options);
		source = super.migrateData(source, options);

		if (source.config) return source;
		source.config ??= {};
		source.config.items = source.items;

		return source;
	}
}

export { ItemGrant };
