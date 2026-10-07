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
		let isInPack = !!this.#item.pack || !!this.#item.parent?.pack;

		containerData.forEach(([id, data]) => {
			// Clean up
			const doc = fromUuidSync(data.uuid);
			if (!doc) updates[`system.items.${id}`] = _del;

			// Set id permanently if not available
			if (data._id === '' && doc) {
				updates[`system.items.${id}._id`] = id;
			}

			// Check if any item is still in a compendium
			if (doc?.pack) isInPack = true;

			data._id = id;
			this.set(id, data);
		});

		if (Object.entries(updates).length && !isInPack) {
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

	/** ---------------------------------- */
	//  Data Helper Methods
	/** ---------------------------------- */

	/** Adds a single instance of an object into the container */
	async add(uuid: string, data: ContainerItemData) {
		if (!data) data = {} as ContainerItemData;

		const obj = await fromUuid<Item.OfType<'object'>>(uuid);
		if (!obj) {
			ui.notifications.error(`Could not find object with uuid: ${uuid}`);
			return;
		}

		if (obj.type !== 'object') {
			ui.notifications.error(`Dropped Item is not an object.`);
			return;
		}

		foundry.utils.mergeObject(data, { uuid });
		data.quantity = obj.system?.quantity ?? 1;

		const key = foundry.utils.randomID();
		data._id = key;

		await this.#item.update({ [`system.items.${key}`]: data });
	}

	/** Adds multiple instances of an object into a container */
	async addMulti(uuids: string[]) {
		const updates = {};

		for await (const uuid of uuids) {
			const obj = await fromUuid<Item.OfType<'object'>>(uuid);
			if (!obj) {
				ui.notifications.error(`Could not find object with uuid: ${uuid}`);
				continue;
			}

			if (obj.type !== 'object') {
				ui.notifications.error(`Item with uuid: ${uuid} is not of type object`);
				continue;
			}

			const key = foundry.utils.randomID();
			updates[`system.items.${key}`] = {
				_id: key,
				quantity: obj.system?.quantity ?? 1,
				uuid,
			};
		}

		await this.#item.update(updates);
	}

	/** Clean the container  */
	async clean() {
		const updates = {};

		[...this.values()].forEach((i) => {
			const child = fromUuidSync(i.uuid);
			if (!child) updates[`system.items.${i._id}`] = _del;
		});

		await this.#item.update(updates);
	}

	/** Removes an object from the container */
	async remove(uuid: string) {
		const key = [...this.values()].find((i) => i.uuid === uuid)?._id;
		if (!key) return;

		await this.#item.update({ [`system.items.${key}`]: _del });
	}

	/** Remove multiple objects from a container */
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

	/** Remove all objects from a container */
	async removeAll() {
		const keys = [...this.keys()];
		if (!keys.length) return;

		const updates = {};
		keys.forEach((key) => {
			updates[`system.items.${key}`] = _del;
		});

		await this.#item.update(updates);
	}

	/** ---------------------------------- */
	//  Static Methods
	/** ---------------------------------- */

	/** Create a container on an actor */
	static async createContainerOnActor(actor: Actor, item: Item.OfType<'object'>): Promise<any> {
		await item.containerItems?.clean();

		const containerData = foundry.utils.duplicate(Object.values(item.system.items));

		// Empty container
		await item.containerItems?.removeAll();

		const items: ObjectA5E[] = [];

		await Promise.all(
			containerData.map(async ({ quantity, uuid }) => {
				const d = await fromUuid<Item.OfType<'object'>>(uuid);
				if (!d) return;

				const doc = d.toObject() as unknown as ObjectA5E;
				// @ts-expect-error
				delete doc._id;

				doc.system.containerId = item.uuid!;
				doc.system.quantity = quantity || doc.system.quantity;

				// Update compendium source
				if (uuid.startsWith('Compendium')) doc._stats.compendiumSource = uuid;

				items.push(doc);
			}),
		);

		const newItemUuids =
			items.length > 0
				? (await actor.createEmbeddedDocuments('Item', items)).map((i: any) => i.uuid)
				: [];

		await item.containerItems?.addMulti(newItemUuids);
		return item;
	}

	/** Creates items from a container onto an Actor */
	static async unpackContainerOnActor(actor: Actor, item: ObjectA5E): Promise<void> {
		const containerData: ContainerItemData[] = Object.values(item.system.items ?? {});

		const items: ObjectA5E[] = [];

		await Promise.all(
			containerData.map(async ({ quantity, uuid }) => {
				const d = await fromUuid<Item.OfType<'object'>>(uuid);
				if (!d) return;

				const doc = d.toObject() as unknown as ObjectA5E;
				// @ts-expect-error
				delete doc._id;

				doc.system.containerId = '';
				doc.system.quantity = quantity || doc.system.quantity;

				// Update compendium source
				if (uuid.startsWith('Compendium')) doc._stats.compendiumSource = uuid;

				items.push(doc);
			}),
		);

		if (items.length > 0) await actor.createEmbeddedDocuments('Item', items);

		await item.delete();
	}

	/** Creates a container on the sidebar */
	static async createContainerOnSidebar(
		item: ObjectA5E,
		folderId: string | null = null,
	): Promise<any> {
		folderId = folderId || item.folder?._id || null;

		await item.containerItems?.clean();
		const containerData: ContainerItemData[] = foundry.utils.duplicate(
			Object.values(item.system.items),
		);

		// Empty container
		await item.containerItems?.removeAll();

		const items: ObjectA5E[] = [];

		await Promise.all(
			containerData.map(async ({ quantity, uuid }) => {
				const d = await fromUuid<Item.OfType<'object'>>(uuid);
				if (!d) return;

				const doc = d.toObject() as unknown as ObjectA5E;
				// @ts-expect-error
				delete doc._id;

				doc.system.containerId = item.uuid!;
				doc.system.quantity = quantity || doc.system.quantity;

				// Update compendium source
				if (uuid.startsWith('Compendium')) doc._stats.compendiumSource = uuid;

				// @ts-expect-error
				if (folderId) doc.folder = folderId;

				items.push(doc);
			}),
		);

		const ids = (await Item.createDocuments(items)).map((i: any) => i.uuid);
		await item.containerItems?.addMulti(ids);

		if (folderId) await item.update({ folder: folderId });
		return item;
	}
}

declare namespace ContainerManager {
	type ContainerItemData = ObjectA5E['system']['items'][string];
}

export { ContainerManager };
