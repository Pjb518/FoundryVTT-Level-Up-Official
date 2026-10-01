import ManeuverGrantConfig from '#view/components/grants/ManeuverGrantConfig.svelte';
import ManeuverGrantSelectionDialog from '#view/components/grants/ManeuverGrantSelectionDialog.svelte';
import { BaseGrant } from './BaseGrant.ts';
import { documentGrantSchema, filterSchema } from './common.ts';

import fields = foundry.data.fields;

// ======================================================
// Schema
// ======================================================
const maneuverEntrySchema = () =>
	new fields.SchemaField({
		uuid: new fields.StringField({ required: true, nullable: false, initial: '' }),
		exertionCost: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
	});

const schema = () => ({
	config: new fields.SchemaField({
		selectionType: new fields.StringField({
			required: true,
			nullable: false,
			initial: 'limited',
			choices: { limited: 'Limited', pool: 'Pool' },
		}),

		// Options Config
		maneuvers: new fields.SchemaField({
			base: new fields.ArrayField(maneuverEntrySchema()),
			options: new fields.ArrayField(maneuverEntrySchema()),
			total: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
		}),
		// List config
		pool: new fields.SchemaField({
			count: new fields.NumberField({ required: true, nullable: false, initial: 1 }),
			filters: new fields.TypedObjectField(filterSchema(), { required: true, nullable: false }),
		}),

		// Changes Config
		changes: new fields.JSONField({ required: true, nullable: true, initial: null }),
		consumerData: new fields.SchemaField({
			type: new fields.StringField({
				required: true,
				nullable: false,
				initial: 'exertion',
				choices: { actionUses: 'Action Uses', itemUses: 'Item Uses', exertion: 'Exertion' },
			}),
			recover: new fields.StringField({ required: true, nullable: false, initial: 'longRest' }),
			value: new fields.StringField({ required: true, nullable: false, initial: '' }),
		}),
	}),

	applied: new fields.SchemaField(documentGrantSchema(), { required: true, nullable: false }),

	// Overrides
	name: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'New Maneuver Grant',
	}),
	type: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		initial: 'maneuver',
	}),
});

// ======================================================
//                      NameSpace
// ======================================================
declare namespace ManeuverGrant {
	type Schema = BaseGrant.Schema & ReturnType<typeof schema>;
}

class ManeuverGrant extends BaseGrant<ManeuverGrant.Schema> {
	#component = ManeuverGrantSelectionDialog;

	#configComponent = ManeuverGrantConfig;

	#type = 'maneuver';

	static override type = 'maneuver';

	static override defineSchema(): ManeuverGrant.Schema {
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
			documentType: 'maneuver',
			isApplied: true,
		};

		// Construct documents
		const entries = [...this.config.maneuvers.base, ...this.config.maneuvers.options];
		const costs = new Map<string, number>(entries.map((e) => [e.uuid, e.exertionCost]));
		const uuids: string[] =
			data?.uuids ?? this.config.maneuvers.base.map(({ uuid }) => uuid) ?? [];

		const consumerData = this.config.consumerData;

		const documents = (
			await Promise.all(
				uuids.map(async (uuid: string) => {
					const d = (await fromUuid(uuid)) as Item.OfType<'maneuver'>;
					if (d?.type !== 'maneuver') return null;

					const doc = d.toObject();

					// Update exertion cost
					const exertionCost = costs.get(uuid) ?? doc.system.exertionCost ?? 0;
					foundry.utils.setProperty(doc, 'system.exertionCost', exertionCost);

					// Update Consumer Data
					const action = d.actions?.default;
					if (action) {
						const actionId = action.id;
						const consumers = Object.entries(doc.system.actions[actionId]?.consumers ?? {});
						const exertionConsumer = consumers.find(
							([, consumer]: [string, any]) =>
								consumer.type === 'resource' && consumer.resource === 'exertion',
						);

						if (consumerData.type === 'exertion') {
							if (exertionConsumer) {
								exertionConsumer[1].quantity = exertionCost;
							} else {
								const consumerId = foundry.utils.randomID();
								foundry.utils.setProperty(
									doc,
									`system.actions.${actionId}.consumers.${consumerId}`,
									{
										id: consumerId,
										quantity: exertionCost,
										type: 'resource',
										resource: 'exertion',
									},
								);
							}
						} else {
							// Delete exertion consumer
							if (exertionConsumer) {
								delete doc.system.actions[actionId].consumers[exertionConsumer[0]];
							}

							// Add uses consumer
							const consumerId = foundry.utils.randomID();
							foundry.utils.setProperty(
								doc,
								`system.actions.${actionId}.consumers.${consumerId}`,
								{
									id: consumerId,
									quantity: 1,
									type: consumerData.type || 'itemUses',
								},
							);

							// Add action uses
							if (consumerData.type === 'actionUses') {
								foundry.utils.setProperty(doc, `system.actions.${actionId}.uses`, {
									value: 0,
									max: consumerData.value || '',
									per: consumerData.recover || 'longRest',
								});
							}
						}
					}

					// Add Item Uses
					if (consumerData.type === 'itemUses') {
						foundry.utils.setProperty(doc, `system.uses`, {
							value: 0,
							max: consumerData.value || '',
							per: consumerData.recover || 'longRest',
						});
					}

					// Update Changes
					if (this.config.changes && typeof this.config.changes !== 'string') {
						foundry.utils.mergeObject(doc, this.config.changes);
					}

					// Delete id
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
		const selectionType = this.config.selectionType || 'limited';

		return {
			base: this.config.maneuvers.base ?? [],
			choices: this.config.maneuvers.options ?? [],
			count: selectionType === 'limited' ? this.config.maneuvers.total : this.config.pool.count,
			selected: data?.uuids ?? [],
		};
	}

	override requiresConfig() {
		return this.config.selectionType === 'limited' ? !!this.config.maneuvers.options.length : true;
	}

	override async configureGrant() {
		const dialogData = {
			document: this.item,
			grantId: this.id,
			grantType: this.#type,
		};

		super.configureGrant('Configure Maneuver Grant', dialogData, this.#configComponent, {
			width: 550,
		});
	}
}

export { ManeuverGrant };
