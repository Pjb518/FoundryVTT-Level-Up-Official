import SpellGrantConfig from '#view/components/grants/SpellGrantConfig.svelte';
import SpellGrantSelectionDialog from '#view/components/grants/SpellGrantSelectionDialog.svelte';
import { BaseGrant } from './BaseGrant.ts';
import { documentGrantSchema } from './common.ts';

import fields = foundry.data.fields;

// ======================================================
// Schema
// ======================================================
const schema = () => ({
	config: new fields.SchemaField({
		spells: new fields.SchemaField({
			base: new fields.ArrayField(
				new fields.StringField({ required: true, nullable: false, intiial: '' }),
			),
			options: new fields.ArrayField(
				new fields.StringField({ required: true, nullable: false, intiial: '' }),
			),
			total: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
		}),
		alwaysPrepared: new fields.BooleanField({ required: true, nullable: false, initial: false }),
		changes: new fields.JSONField({ required: true, nullable: true, initial: null }),
		consumerData: new fields.SchemaField({
			type: new fields.StringField({
				required: true,
				nullable: false,
				initial: 'spell',
				choices: { actionUses: 'Action Uses', itemUses: 'Item Uses', spell: 'Spell' },
			}),
			recover: new fields.StringField({ required: true, nullable: false, initial: '' }),
			value: new fields.StringField({
				required: true,
				nullable: false,
				initial: 'longRest',
			}),
		}),
	}),

	applied: new fields.SchemaField(documentGrantSchema(), { required: true, nullable: false }),

	// Overrides
	name: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'New Spell Grant',
	}),
	type: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		initial: 'spell',
	}),
});

// ======================================================
//                      NameSpace
// ======================================================
declare namespace SpellGrant {
	type Schema = BaseGrant.Schema & ReturnType<typeof schema>;
}

class SpellGrant extends BaseGrant<SpellGrant.Schema> {
	#component = SpellGrantSelectionDialog;

	#configComponent = SpellGrantConfig;

	#type = 'spell';

	static override type = 'spell';

	static override defineSchema(): SpellGrant.Schema {
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
			documentType: 'spell',
			isApplied: true,
		};

		const actorUpdates: Record<string, any> = {};

		// Get / Create Spell book
		const spellBook = data?.spellBook || Object.keys(actor.system.spellBooks ?? {})[0] || 'new';
		let selectedBook: string;

		if (spellBook !== 'new') selectedBook = spellBook;
		else {
			selectedBook = foundry.utils.randomID();
			actorUpdates[`system.spellBooks.${selectedBook}`] = {
				_id: selectedBook,
			};
		}

		// Construct documents
		const uuids = data?.uuids ?? this.config.spells.base ?? [];

		const documents = (
			await Promise.all(
				uuids.map(async (uuid: string) => {
					const d = (await fromUuid(uuid)) as Item.OfType<'spell'>;
					if (d?.type !== 'spell') return null;

					const doc = d.toObject();

					// Add always prepared
					if (this.config.alwaysPrepared) foundry.utils.setProperty(doc, 'system.prepared', 2);

					// Update SpellBook Data
					foundry.utils.setProperty(doc, 'system.spellBook', selectedBook);

					// Update Consumer Data
					const action = d.actions?.default;
					if (action && this.config.consumerData.type !== 'spell') {
						const actionId = action.id;
						const consumers = Object.entries(doc.system.actions[actionId]?.consumers ?? {});

						// Delete spell consumer
						const spellConsumer = consumers.find(([, consumer]) => consumer.type === 'spell');
						if (spellConsumer) {
							delete doc.system.actions[actionId].consumers[spellConsumer[0]];
						}

						// Add uses consumer
						const consumerId = foundry.utils.randomID();
						foundry.utils.setProperty(doc, `system.actions.${actionId}.consumers.${consumerId}`, {
							id: consumerId,
							quantity: 1,
							type: this.config.consumerData.type || 'itemUses',
						});

						// Add action uses
						if (this.config.consumerData.type === 'actionUses') {
							foundry.utils.setProperty(doc, `system.actions.${actionId}.uses`, {
								value: 0,
								max: this.config.consumerData.value || '',
								per: this.config.consumerData.recover || 'longRest',
							});
						}
					}

					// Add Item Uses
					if (this.config.consumerData.type === 'itemUses') {
						foundry.utils.setProperty(doc, `system.uses`, {
							value: 0,
							max: this.config.consumerData.value || '',
							per: this.config.consumerData.recover || 'longRest',
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
			updateData: actorUpdates,
			documents,
		};
	}

	override getSelectionComponent() {
		return this.#component;
	}

	override getSelectionComponentProps(data: any) {
		return {
			base: this.config.spells.base ?? [],
			choices: this.config.spells.options ?? [],
			count: this.config.spells.total,
			selected: data?.uuids ?? [],
			selectedBook: data?.spellBook ?? '',
			actor: this.item!.actor,
		};
	}

	override requiresConfig() {
		return !!this.config.spells.options.length;
	}

	override async configureGrant() {
		const dialogData = {
			document: this.item,
			grantId: this.id,
			grantType: this.#type,
		};

		super.configureGrant('Configure Spell Grant', dialogData, this.#configComponent, {
			width: 400,
		});
	}
}

export { SpellGrant };
