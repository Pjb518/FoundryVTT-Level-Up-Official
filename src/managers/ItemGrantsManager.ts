import type { Grant } from 'types/itemGrants';
import GrantCls from '../dataModels/item/Grants/index';

export default class ItemGrantsManager extends Map<string, Grant> {
	#item: any;

	constructor(item: any) {
		super();

		this.#item = item;
		Object.entries(this.#item.system.grants ?? {}).forEach(([id, data]: Array<any>) => {
			data._id = id;

			let Cls = GrantCls[data.grantType];

			// eslint-disable-next-line no-console
			if (!Cls) console.warn(`Grant ${id} has no class mapping.`);

			Cls ??= GrantCls.base;
			const grant = new Cls(data, { parent: item });

			this.set(id, grant);
		});
	}

	get optionalGrants(): Array<Grant> {
		return [...this.values()].filter((grant) => grant.optional);
	}

	/**
	 * @param {String} type
	 * @returns
	 */
	byType(type: string): Array<Grant> {
		return [...this.values()].filter((grant) => grant.grantType === type);
	}

	byLevel(level: number): Array<Grant> {
		return [...this.values()].filter((grant) => grant.level === level);
	}

	byLevelType(levelType: string): Array<Grant> {
		return [...this.values()].filter((grant) => grant.levelType === levelType);
	}

	byLevelAndType(level: number, grantType: string): Array<Grant> {
		return [...this.values()].filter(
			(grant) => grant.level === level && grant.grantType === grantType,
		);
	}

	/** ************************************************
	 *               External methods
	 * ************************************************ */
	async add(data = {}) {
		await ItemGrantsManager.addGrant(this.#item, data);
	}

	// configure(id: string): void {
	//   const grant = this.get(id);
	//   if (!grant) return;

	//   grant.configureDialog();
	// }

	override async clear() {
		await this.#item.update({
			'system.-=grants': null,
		});

		await this.#item.update({ 'system.grants': {} });
	}

	async duplicate(id: string) {
		const newGrant = foundry.utils.duplicate(this.#item.system.grants[id]);
		newGrant.name = `${newGrant.name} (Copy)`;

		await this.#item.update({
			'system.grants': {
				...this.#item.system.grants,
				// @ts-ignore
				[foundry.utils.randomID()]: newGrant,
			},
		});
	}

	// @ts-ignore
	override async delete(id: string): Promise<void> {
		super.delete(id);

		await this.#item.update({
			'system.grants': {
				[`-=${id}`]: null,
			},
		});

		const actor = this.#item.parent;
		if (!actor || actor.documentName !== 'Actor') return;

		actor.grants.removeGrant(id);
	}

	/** ************************************************
	 *                Static methods
	 * ************************************************ */
	static async addGrant(item: any, data = {}, update = true, returnId = false) {
		// @ts-ignore
		const newGrant: Grant = foundry.utils.mergeObject(
			{
				grantType: 'skill',
				level: 1,
				levelType: ['class', 'archetype'].includes(item.type) ? 'class' : 'character',
			},
			data,
		);

		const id = foundry.utils.randomID();
		newGrant._id = id;

		const updateData = {
			'system.grants': {
				...item.system.grants,
				// @ts-ignore
				[id]: newGrant,
			},
		};

		if (update) await item.update(updateData);
		if (returnId) return [id, updateData];
		return updateData;
	}
}
