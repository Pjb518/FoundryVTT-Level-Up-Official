import FeatureGrantConfig from '#view/components/grants/FeatureGrantConfig.svelte';
import FeatureGrantSelectionDialog from '#view/components/grants/FeatureGrantSelectionDialog.svelte';
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
		features: new fields.SchemaField({
			base: new fields.ArrayField(
				new fields.SchemaField({
					uuid: new fields.StringField({ required: true, nullable: false, initial: '' }),
					limitedReselection: new fields.BooleanField({
						required: true,
						nullable: false,
						initial: true,
					}),
					selectionLimit: new fields.NumberField({ required: true, nullable: false, inital: 1 }),
				}),
			),
			options: new fields.ArrayField(
				new fields.SchemaField({
					uuid: new fields.StringField({ required: true, nullable: false, initial: '' }),
					limitedReselection: new fields.BooleanField({
						required: true,
						nullable: false,
						initial: true,
					}),
					selectionLimit: new fields.NumberField({ required: true, nullable: false, inital: 1 }),
				}),
			),
			total: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
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
	features: new fields.SchemaField({
		/** @deprecated */
		base: new fields.ArrayField(
			new fields.SchemaField({
				uuid: new fields.StringField({ required: true, nullable: false, initial: '' }),
				limitedReselection: new fields.BooleanField({
					required: true,
					nullable: false,
					initial: true,
				}),
				selectionLimit: new fields.NumberField({ required: true, nullable: false, initial: 1 }),
			}),
		),
		/** @deprecated */
		options: new fields.ArrayField(
			new fields.SchemaField({
				uuid: new fields.StringField({ required: true, nullable: false, initial: '' }),
				limitedReselection: new fields.BooleanField({
					required: true,
					nullable: false,
					initial: true,
				}),
				selectionLimit: new fields.NumberField({ required: true, nullable: false, initial: 1 }),
			}),
		),
		/** @deprecated */
		total: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
	}),

	// Overrides
	name: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'New Feature Grant',
	}),
	type: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		initial: 'feature',
	}),
});

// ======================================================
//                      NameSpace
// ======================================================
declare namespace FeatureGrant {
	type Schema = BaseGrant.Schema & ReturnType<typeof schema>;
}

class FeatureGrant extends BaseGrant<FeatureGrant.Schema> {
	#component = FeatureGrantSelectionDialog;

	#configComponent = FeatureGrantConfig;

	#type = 'feature';

	static override type = 'feature';

	static override defineSchema(): FeatureGrant.Schema {
		// @ts-expect-error
		return {
			...super.defineSchema(),
			...schema(),
		};
	}

	override async getApplyData(actor: any, data: any): any {
		if (!actor) return {};

		// Construct applied data
		const appliedData: typeof this.applied = {
			grantType: 'document',
			level: this.level,
			documentIds: [] as unknown as Set<string>, // This should be applied later
			documentType: 'feature',
			isApplied: true,
		};

		// Construct documents
		const uuids = data?.uuids ?? this.config.features.base.map(({ uuid }) => uuid) ?? [];

		const documents = (
			await Promise.all(
				uuids.map(async (uuid: string) => {
					const d = (await fromUuid(uuid)) as Item.OfType<'feature'>;
					if (d?.type !== 'feature') return null;

					const doc = d.toObject();

					// Update Changes
					if (this.config.changes && typeof this.config.changes !== 'string') {
						foundry.utils.mergeObject(doc, this.config.changes);
					}

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
			base: this.config.features.base,
			choices: this.config.features.options,
			count: this.selectionType === 'limited' ? this.config.features.total : this.config.pool.count,
			selected: data?.uuids ?? [],
		};
	}

	override requiresConfig(): boolean {
		return this.config.selectionType === 'limited' ? !!this.config.features.options.length : true;
	}

	override async configureGrant() {
		const dialogData = {
			document: this.item,
			grantId: this.id,
			grantType: this.#type,
		};

		super.configureGrant('Configure Feature Grant', dialogData, this.#configComponent, {
			width: 550,
		});
	}
}

export { FeatureGrant };
