/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import type ObjectItemA5e from '../documents/item/object';

import SubObjectField from '../dataModels/fields/SubObjectField';

export default class ContainerManager extends Map<string, SubObjectField> {
	#item: InstanceType<typeof ObjectItemA5e>;

	constructor(item: InstanceType<typeof ObjectItemA5e>) {
		if (!item) {
			throw Error('Item is required to create a ContainerManager');
		}

		if (item.system?.objectType !== 'container') {
			throw Error('Item must be a container to create a ContainerManager');
		}

		super();
		this.#item = item;

		const containerData: [string, SubObjectField][] = Object.entries(this.#item.system.items ?? {});

		containerData.forEach(([id, data]) => {
			data._id = id;

			// @ts-ignore
			const doc = new SubObjectField(data, { parent: item });
			if (!doc) return;

			this.set(id, doc);
		});
	}

	get items() {
		const parent = this.#item;
		const docUuids = [...this.values()].map((e) => e.uuid);

		if (parent.isEmbedded) {
			const docs: unknown[] = docUuids.map((uuid) => fromUuidSync(uuid));
			return docs as (InstanceType<typeof ObjectItemA5e> | null)[];
		}

		if (parent.pack) {
			const p: Promise<(unknown | null)[]> = Promise.all(docUuids.map((uuid) => fromUuid(uuid)));
			return p as Promise<(InstanceType<typeof ObjectItemA5e> | null)[]>;
		}

		const docs: unknown[] = docUuids.map((uuid) => fromUuidSync(uuid));
		return docs as (InstanceType<typeof ObjectItemA5e> | null)[];
	}

	/** ************************************************
	 *               Functionality
	 * ************************************************ */
	get allItems(): any[] | Promise<any[]> {
		const all: any[] = [];
		const { items } = this;

		if (items instanceof Promise) {
			items.then((promisedItems) => {
				all.push(...promisedItems);

				promisedItems.forEach((i) => {
					if (i?.system?.objectType === 'container') {
						all.push(...(i?.containerItems?.allItems ?? []));
					}
				});
			});

			return all.filter((i) => !!i);
		}

		items.forEach((i) => {
			all.push(i);

			if (i?.system?.objectType === 'container') {
				const subItems = i.containerItems?.allItems;
				if (subItems instanceof Promise) subItems.then((si) => all.push(...(si ?? [])));
				else all.push(...(subItems ?? []));
			}
		});

		return all.filter((i) => !!i);
	}

	get bulkyCount(): number | Promise<number> {
		const contents = this.allItems;
		if (contents instanceof Promise) {
			return contents.then((items) =>
				items.reduce((acc, i) => {
					if (i.system?.bulky) return acc + 1;
					return acc;
				}, 0),
			);
		}

		return contents.reduce((acc, i) => {
			if (i.system?.bulky) return acc + 1;
			return acc;
		}, 0);
	}

	get count(): number | Promise<number> {
		const contents = this.allItems;
		if (contents instanceof Promise) {
			return contents.then((items) => items.reduce((acc, i) => acc + i.system.quantity, 0));
		}

		return contents.reduce((acc, i) => acc + i.system.quantity, 0);
	}

	get weight(): number | Promise<number> {
		const hasWeightlessContents = this.#item.system?.capacity?.weightlessContents ?? false;
		if (hasWeightlessContents) return 0;

		const contents = this.allItems;
		if (contents instanceof Promise) {
			return contents.then((items) =>
				items.reduce((acc, i) => acc + i.system.quantity * i.system.weight, 0),
			);
		}

		return contents.reduce((acc, i) => acc + i.system.quantity * i.system.weight, 0);
	}

	async capacity() {
		const { value, type } = this.#item.system.capacity;

		const data = {
			max: value ?? Infinity,
			percentage: 0,
			unit: '',
			value: 0,
		};

		if (type === 'bulk') {
			data.value = await this.bulkyCount;
			data.unit = 'bulk';
		} else if (type === 'weight') {
			data.value = await this.weight;
			data.unit = 'lbs';
		} else if (type === 'count') {
			data.value = await this.count;
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
			updates[`system.items.${key}`] = { uuid, quantity: obj.system?.quantity ?? 1 };
		});

		await this.#item.update(updates);
	}

	async clean() {
		const updates = {};

		[...this.values()].forEach((i) => {
			const child = fromUuidSync(i.uuid);
			if (!child) updates[`system.items.-=${i._id}`] = null;
		});

		await this.#item.update(updates);
	}

	cleanSync() {
		const updates = {};

		[...this.values()].forEach((i) => {
			const child = fromUuidSync(i.uuid);
			if (!child) updates[`system.items.-=${i._id}`] = null;
		});

		this.#item.update(updates);
	}

	async remove(uuid: string) {
		const key = [...this.values()].find((i) => i.uuid === uuid)?._id;
		if (!key) return;

		await this.#item.update({ [`system.items.-=${key}`]: null });
	}

	async removeMulti(uuids: string[]) {
		const keys = [...this.values()].reduce((acc: string[], i) => {
			if (uuids.includes(i.uuid)) acc.push(i._id);
			return acc;
		}, []);

		if (!keys.length) return;

		const updates = {};
		keys.forEach((key) => {
			updates[`system.items.-=${key}`] = null;
		});

		await this.#item.update(updates);
	}

	async removeAll() {
		const keys = [...this.keys()];
		if (!keys.length) return;

		const updates = {};
		keys.forEach((key) => {
			updates[`system.items.-=${key}`] = null;
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
				items.push(doc);
			}),
		);

		const ids = (await actor.createEmbeddedDocuments('Item', items)).map((i: any) => i.uuid);
		await item.containerItems.addMulti(ids);
		return item;
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
