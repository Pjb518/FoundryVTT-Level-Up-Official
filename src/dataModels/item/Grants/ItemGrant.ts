import BaseGrant from './BaseGrant';

import ItemGrantSelectionDialog from '../../../apps/components/grants/ItemGrantSelectionDialog.svelte';
import ItemGrantConfig from '../../../apps/components/grants/ItemGrantConfig.svelte';

export default class ItemGrant extends BaseGrant {
	#component = ItemGrantSelectionDialog;

	#configComponent = ItemGrantConfig;

	#type = 'item';

	// Variables for the schema

	declare items: {
		base: { uuid: string; quantityOverride: number }[];
		options: { uuid: string; quantityOverride: number }[];
		total: number;
	};

	static override defineSchema() {
		const { fields } = foundry.data;

		return this.mergeSchema(super.defineSchema(), {
			grantType: new fields.StringField({ required: true, initial: 'item' }),
			items: new fields.SchemaField({
				base: new fields.ArrayField(
					new fields.SchemaField({
						uuid: new fields.StringField({ required: true, initial: '' }),
						quantityOverride: new fields.NumberField({ required: true, initial: 0, integer: true }),
					}),
					{ required: true, default: [] },
				),
				options: new fields.ArrayField(
					new fields.SchemaField({
						uuid: new fields.StringField({ required: true, initial: '' }),
						quantityOverride: new fields.NumberField({ required: true, initial: 0, integer: true }),
					}),
				),
				total: new fields.NumberField({ required: true, initial: 0, integer: true }),
			}),
			label: new fields.StringField({ required: true, initial: 'New Item Grant' }),
		});
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	override getApplyData(actor: any, data: any): any {
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
			base: this.items.base.map(({ uuid }) => uuid) ?? [],
			choices: this.items.options.map(({ uuid }) => uuid) ?? [],
			count: this.items.total,
			selected: data?.uuids ?? [],
		};
	}

	override requiresConfig() {
		return !!this.items.options.length;
	}

	override async configureGrant() {
		const dialogData = {
			document: this?.parent,
			grantId: this._id,
			grantType: this.#type,
		};

		super.configureGrant('Configure Item Grant', dialogData, this.#configComponent, { width: 400 });
	}
}
