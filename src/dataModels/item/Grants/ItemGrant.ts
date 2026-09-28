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
		initial: 'New Item Grant',
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

		const appliedData: typeof this.applied = {
			grantType: 'document',
			level: this.level,
			documentIds: [] as unknown as Set<string>, // This should be applied later
			documentType: 'object',
			isApplied: true,
		};

		return { appliedData: this._getAppliedUpdate(appliedData), updateData: {} };
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
			document: this.item,
			grantId: this.id,
			grantType: this.#type,
		};

		super.configureGrant('Configure Item Grant', dialogData, this.#configComponent, { width: 400 });
	}
}

export { ItemGrant };
