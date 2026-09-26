import FeatureGrantConfig from '#view/components/grants/FeatureGrantConfig.svelte';
import FeatureGrantSelectionDialog from '#view/components/grants/FeatureGrantSelectionDialog.svelte';
import { BaseGrant } from './BaseGrant.ts';
import { documentGrantSchema } from './common.ts';

import fields = foundry.data.fields;

// ======================================================
// Schema
// ======================================================
const schema = () => ({
	// Config
	config: new fields.SchemaField({
		features: new fields.SchemaField({
			base: new fields.ArrayField(
				new fields.SchemaField({
					uuid: new fields.StringField({ required: true, nullable: false, initial: '' }),
					limitedReselction: new fields.BooleanField({
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
					limitedReselction: new fields.BooleanField({
						required: true,
						nullable: false,
						initial: true,
					}),
					selectionLimit: new fields.NumberField({ required: true, nullable: false, inital: 1 }),
				}),
			),
			total: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
		}),
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
				limitedReselction: new fields.BooleanField({
					required: true,
					nullable: false,
					initial: true,
				}),
				selectionLimit: new fields.NumberField({ required: true, nullable: false, inital: 1 }),
			}),
		),
		/** @deprecated */
		options: new fields.ArrayField(
			new fields.SchemaField({
				uuid: new fields.StringField({ required: true, nullable: false, initial: '' }),
				limitedReselction: new fields.BooleanField({
					required: true,
					nullable: false,
					initial: true,
				}),
				selectionLimit: new fields.NumberField({ required: true, nullable: false, inital: 1 }),
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

	override getApplyData(actor: any, data: any): any {
		if (!actor) return {};

		const appliedData: typeof this.applied = {
			grantType: 'document',
			level: this.level,
			documentIds: [] as unknown as Set<string>, // This should be applied later
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
			base: this.config.features.base,
			choices: this.config.features.options,
			count: this.config.features.total,
			selected: data?.uuids ?? [],
		};
	}

	override requiresConfig(): boolean {
		return !!this.config.features.options.length;
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

	static override migrateData(source: any, options: any) {
		options ??= {};
		source = super.migrateData(source, options);

		if (source.config) return source;
		source.config ??= {};
		source.config.features = source.features;

		return source;
	}
}

export { FeatureGrant };
