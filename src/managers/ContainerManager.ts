import type SubObjectField from '../dataModels/fields/SubObjectField.ts';

type ObjectA5E = Item.OfType<'object'>;
type ContainerItemData = ObjectA5E['system']['items'][string];

class ContainerManager extends Map<string, ContainerItemData> {
	#item: ObjectA5E;

	constructor(item: ObjectA5E) {
		if (!item) {
			throw Error('Item is required to create a ContainerManager');
		}

		if (item.system?.objectType !== 'container') {
			throw Error('Item must be a container to create a ContainerManager');
		}

		super();
		this.#item = item;

		const containerData = Object.entries(this.#item.system.items ?? {});

		const updates: Record<string, any> = {};

		containerData.forEach(([id, data]) => {
			// Clean up
			const doc = fromUuidSync(data.uuid);
			if (!doc) updates[`system.items.${id}`] = _del;

			// Set id permanently if not available
			if (data._id === '' && doc) {
				updates[`system.items.${id}._id`] = id;
			}

			data._id = id;
			this.set(id, data);
		});

		if (Object.entries(updates).length) {
			ui.notifications.warn(`Cleaning up deleted items from ${this.#item.name}`);
			this.#item.update(updates);
		}
	}

	/** ---------------------------------- */
	//  Getters
	/** ---------------------------------- */

	/** Gets the items of the container. */
	get items(): ObjectA5E[] {
		const item = this.#item;
		const parent = item.parent;

		if (!parent) return [];
		if (parent.pack) return [];

		const docUuids = [...this.values()].map((e) => e.uuid);

		if (parent.isEmbedded) {
			const docs = docUuids.map((uuid) => fromUuidSync<ObjectA5E>(uuid));
			return docs.filter(Boolean) as ObjectA5E[];
		}

		// if (parent.pack) {
		// return Promise.all(docUuids.map((uuid) => fromUuid<ObjectA5E>(uuid))).then((docs) => {
		// return docs.filter(Boolean) as ObjectA5E[];
		// });
		// }

		const docs = docUuids.map((uuid) => fromUuidSync<ObjectA5E>(uuid));
		return docs.filter(Boolean) as ObjectA5E[];
	}

	/** Gets all the items of the container including sub containers.  */
	get allItems(): ObjectA5E[] {
		const item = this.#item;
		const parent = item.parent;

		if (!parent) return [];
		if (parent.pack) return [];

		const items = this.items as ObjectA5E[];

		return items.reduce((docs, i) => {
			docs.push(i);

			if (i.system?.objectType === 'container') {
				docs.push(...((i.containerItems!.allItems ?? []) as ObjectA5E[]));
			}

			return docs;
		}, [] as ObjectA5E[]);
	}

	// /** Async helper for {@link allItems} */
	// async _allItems(): Promise<ObjectA5E[]> {
	// const items = await this.items;
	//
	// return items.reduce(
	// async (prom, i) => {
	// const docs = await prom;
	// docs.push(i);
	//
	// if (i.system?.objectType === 'container') {
	// const subDocs = await i.containerItems!.allItems;
	// docs.push(...subDocs);
	// }
	//
	// return docs;
	// },
	// [] as unknown as Promise<ObjectA5E[]>,
	// );
	// }

	/** Gets the bulk count for each item in the container */
	get bulkyCount(): number {
		const contents = this.allItems as ObjectA5E[];

		// if (contents instanceof Promise) {
		// return contents.then((items) =>
		// items.reduce((acc, i) => {
		// if (i.system?.bulky) return acc + 1;
		// return acc;
		// }, 0),
		// );
		// }

		return contents.reduce((acc, i) => {
			if (i.system?.bulky) return acc + 1;
			return acc;
		}, 0);
	}

	/** Gets the number of items in the container */
	get count(): number {
		const contents = this.allItems as ObjectA5E[];

		// if (contents instanceof Promise) {
		// return contents.then((items) => items.reduce((acc, i) => acc + i.system.quantity, 0));
		// }

		return contents.reduce((acc, i) => acc + i.system.quantity, 0);
	}

	/** Gets the total weight of the container. Can be a promise if in pack  */
	get weight(): number {
		const hasWeightlessContents = this.#item.system?.capacity?.weightlessContents ?? false;
		if (hasWeightlessContents) return this.#item.system.weight;

		const contents = this.allItems as ObjectA5E[];

		// NOTE: We don't do recursive weight for compendiums
		// if (contents instanceof Promise) {
		// return contents.then((items) =>
		// items.reduce((acc, i) => acc + i.system.quantity * i.system.weight, 0),
		// );
		// }

		const includeCurrency =
			this.#item.actor?.getFlag('a5e', 'trackCurrencyWeight') ??
			game.settings.get('a5e', 'currencyWeight');

		const coinWeight = Object.values(this.#item.system.currency ?? {}).reduce(
			(acc, curr) => acc + Number(curr),
		);

		const itemWeight = contents.reduce((acc, i) => {
			let weight = 0;

			if (i.system?.objectType === 'container') {
				weight = (i.containerItems!.weight as number) ?? 0;
			} else {
				weight = (i.system.quantity ?? 1) * (i.system.weight ?? 0);
			}

			return acc + weight;
		}, 0);

		return includeCurrency ? itemWeight + coinWeight * 0.02 : itemWeight;
	}

	/** Get Capacity data for a container */
	capacity() {
		const { value, type } = this.#item.system.capacity;

		const data = {
			max: value ?? Infinity,
			percentage: 0,
			unit: '',
			value: 0,
		};

		if (type === 'bulk') {
			data.value = this.bulkyCount;
			data.unit = 'bulk';
		} else if (type === 'weight') {
			data.value = this.weight;
			data.unit = 'lbs';
		} else if (type === 'count') {
			data.value = this.count;
			data.unit = 'items';
		}

		// Calculate percentage
		data.percentage = Math.round(Math.clamp(data.max ? (data.value / data.max) * 100 : 0, 0, 100));

		return data;
	}

	/** ************************************************
	 *               Data Helper methods
	 * ************************************************ */
	async add(uuid: string, data: SubObjectField) {
		if (!data) data = {} as SubObjectField;

		const obj = fromUuidSync(uuid);
		if (!obj) {
			ui.notifications.error(`Could not find object with uuid: ${uuid}`);
			return;
		}

		foundry.utils.mergeObject(data, { uuid });
		data.quantity = obj.system?.quantity ?? 1;

		const key = foundry.utils.randomID();
		await this.#item.update({ [`system.items.${key}`]: data });
	}

	async addMulti(uuids: string[]) {
		const updates = {};

		uuids.forEach(async (uuid) => {
			const obj = fromUuidSync(uuid);
			if (!obj) {
				ui.notifications.error(`Could not find object with uuid: ${uuid}`);
				return;
			}

			const key = foundry.utils.randomID();
			updates[`system.items.${key}`] = {
				uuid,
				quantity: obj.system?.quantity ?? 1,
			};
		});

		await this.#item.update(updates);
	}

	async clean() {
		const updates = {};

		[...this.values()].forEach((i) => {
			const child = fromUuidSync(i.uuid);
			if (!child) updates[`system.items.${i._id}`] = _del;
		});

		await this.#item.update(updates);
	}

	cleanSync() {
		const updates = {};

		[...this.values()].forEach((i) => {
			const child = fromUuidSync(i.uuid);
			if (!child) updates[`system.items.${i._id}`] = _del;
		});

		this.#item.update(updates);
	}

	async remove(uuid: string) {
		const key = [...this.values()].find((i) => i.uuid === uuid)?._id;
		if (!key) return;

		await this.#item.update({ [`system.items.${key}`]: _del });
	}

	async removeMulti(uuids: string[]) {
		const keys = [...this.values()].reduce((acc: string[], i) => {
			if (uuids.includes(i.uuid)) acc.push(i._id);
			return acc;
		}, []);

		if (!keys.length) return;

		const updates = {};
		keys.forEach((key) => {
			updates[`system.items.${key}`] = _del;
		});

		await this.#item.update(updates);
	}

	async removeAll() {
		const keys = [...this.keys()];
		if (!keys.length) return;

		const updates = {};
		keys.forEach((key) => {
			updates[`system.items.${key}`] = _del;
		});

		await this.#item.update(updates);
	}

	/** ************************************************
	 *               Static methods
	 * ************************************************ */
	static async createContainerOnActor(actor: any, item: any): Promise<any> {
		await item.containerItems?.clean();

		const containerData: Array<any> = foundry.utils.duplicate(Object.values(item.system.items));

		// Empty container
		await item.containerItems.removeAll();

		const items: (typeof Item)[] = [];
		const existingItemUuids: string[] = [];

		await Promise.all(
			containerData.map(async ({ quantityOverride, uuid }) => {
				let doc = await fromUuid(uuid);
				if (!doc) return;

				if (doc.parent && doc.parent._id === actor._id) {
					await doc.update({
						'system.containerId': item.uuid,
						...(quantityOverride && { 'system.quantity': quantityOverride }),
					});
					existingItemUuids.push(doc.uuid);
				} else {
					doc = doc.toObject();
					doc.system.containerId = item.uuid;

					if (quantityOverride) {
						doc.system.quantity = quantityOverride ?? doc.system.quantity;
					}
					if (uuid.startsWith('Compendium')) doc._stats.compendiumSource = uuid;
					items.push(doc);
				}
			}),
		);

		const newItemUuids =
			items.length > 0
				? (await actor.createEmbeddedDocuments('Item', items)).map((i: any) => i.uuid)
				: [];

		const ids = [...existingItemUuids, ...newItemUuids];

		await item.containerItems.addMulti(ids);
		return item;
	}

	static async unpackContainerOnActor(actor: any, item: any): Promise<void> {
		const multiplier = Math.max(1, item.system.quantity ?? 1);
		const containerData: Array<any> = Object.values(item.system.items ?? {});

		const items: any[] = [];
		await Promise.all(
			containerData.map(async ({ quantityOverride, uuid }) => {
				const doc = await fromUuid(uuid);
				if (!doc) return;

				const data = doc.toObject();
				delete data._id;
				data.system.containerId = '';
				data.system.quantity = (quantityOverride || data.system.quantity) * multiplier;

				if (uuid.startsWith('Compendium')) data._stats.compendiumSource = uuid;
				items.push(data);
			}),
		);

		if (items.length > 0) await actor.createEmbeddedDocuments('Item', items);
		await item.delete();
	}

	static async createContainerOnSidebar(item: any, folderId: string | null = null): Promise<any> {
		folderId = folderId || item.folder._id || null;

		await item.containerItems?.clean();
		const containerData: Array<any> = foundry.utils.duplicate(Object.values(item.system.items));

		// Empty container
		await item.containerItems.removeAll();

		const items: (typeof Item)[] = [];
		await Promise.all(
			containerData.map(async ({ quantityOverride, uuid }) => {
				let doc = await fromUuid(uuid);
				if (!doc) return;

				doc = doc.toObject();
				doc.system.containerId = item.uuid;
				if (quantityOverride) {
					doc.system.quantity = quantityOverride ?? doc.system.quantityOverride;
				}

				if (uuid.startsWith('Compendium')) doc._stats.compendiumSource = uuid;
				if (folderId) doc.folder = folderId;

				items.push(doc);
			}),
		);

		const ids = (await Item.createDocuments(items)).map((i: any) => i.uuid);
		await item.containerItems.addMulti(ids);
		if (folderId) await item.update({ folder: folderId });
		return item;
	}
}

declare namespace ContainerManager {
	type ContainerItemData = ObjectA5E['system']['items'][string];
}

export { ContainerManager };
