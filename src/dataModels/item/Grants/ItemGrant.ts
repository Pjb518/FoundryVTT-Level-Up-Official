import ItemGrantConfig from '#view/components/grants/ItemGrantConfig.svelte';
import ItemGrantSelectionDialog from '#view/components/grants/ItemGrantSelectionDialog.svelte';
import { BaseGrant } from './BaseGrant.ts';
import { documentGrantSchema, filterSchema } from './common.ts';

import fields = foundry.data.fields;

// ======================================================
// Schema
// ======================================================
const schema = () => ({
	// Config
	config: new fields.SchemaField({
		selectionType: new fields.StringField({
			required: true,
			nullable: false,
			initial: 'limited',
			choices: { limited: 'Limited', pool: 'Pool' },
		}),

		// Options Config
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

		// List config
		pool: new fields.SchemaField({
			count: new fields.NumberField({ required: true, nullable: false, initial: 1 }),
			filters: new fields.TypedObjectField(filterSchema(), { required: true, nullable: false }),
		}),

		// Changes Config
		changes: new fields.JSONField({ required: true, nullable: true, initial: null }),
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

	override async getApplyData(actor: Character, data: any): any {
		if (!actor) return {};

		// Construct applied data
		const appliedData: typeof this.applied = {
			grantType: 'document',
			level: this.level,
			documentIds: [] as unknown as Set<string>, // This should be applied later
			documentType: 'object',
			isApplied: true,
		};

		// Construct documents
		const allOptions =
			this.config.selectionType === 'limited'
				? [...this.config.items.base, ...this.config.items.options]
				: (data?.uuids.map((uuid) => ({ uuid, quantityOverride: 0 })) ?? []);

		const uuids = new Set<string>(
			data?.uuids ?? this.config.items.base.map(({ uuid }) => uuid) ?? [],
		);

		const documents = (
			await Promise.all(
				allOptions.map(async ({ uuid, quantityOverride }) => {
					if (!uuids.has(uuid)) return null;
					const d = (await fromUuid(uuid)) as Item.OfType<'object'>;
					if (d?.type !== 'object') return null;

					const doc = d.toObject();

					// Update quantity
					if (quantityOverride) {
						foundry.utils.setProperty(doc, 'system.quantity', quantityOverride);
					}

					// Update container id
					foundry.utils.setProperty(doc, 'system.containerId', '');

					// Update Changes
					if (this.config.changes && typeof this.config.changes !== 'string') {
						foundry.utils.mergeObject(doc, this.config.changes);
					}

					// Delete Id
					// @ts-expect-error
					delete doc._id;

					return doc;
				}),
			)
		).filter(Boolean);

		return {
			appliedData: this._getAppliedUpdate(appliedData),
			updateData: {},
			documents,
		};
	}

	override getSelectionComponent() {
		return this.#component;
	}

	override getSelectionComponentProps(data: any) {
		return {
			base: this.config.items.base.map(({ uuid }) => uuid) ?? [],
			choices: this.config.items.options.map(({ uuid }) => uuid) ?? [],
			count: this.selectionType === 'limited' ? this.config.items.total : this.config.pool.count,
			selected: data?.uuids ?? [],
		};
	}

	override requiresConfig() {
		return this.config.selectionType === 'limited' ? !this.config.items.options.length : true;
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
