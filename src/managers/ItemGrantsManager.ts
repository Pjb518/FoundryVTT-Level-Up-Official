import type { Grant, GrantTypes } from '#data/item/Grants/GrantsField.ts';

export class ItemGrantsManager extends Map<string, Grant> {
	#item: Item.OfType<'feature'> | OriginItems;

	constructor(item: any) {
		super();

		this.#item = item;
		Object.entries(this.#item.system.grants ?? {}).forEach(([id, grant]: Array<any>) => {
			grant.id = id;
			this.set(id, grant);
		});
	}

	get optionalGrants(): Array<Grant> {
		return [...this.values()].filter((grant) => grant.optional);
	}

	byType(type: GrantTypes): Array<Grant> {
		return [...this.values()].filter((grant) => grant.type === type);
	}

	byLevel(level: number): Array<Grant> {
		return [...this.values()].filter((grant) => grant.level === level);
	}

	byLevelType(levelType: string): Array<Grant> {
		return [...this.values()].filter((grant) => grant.levelType === levelType);
	}

	byLevelAndType(level: number, grantType: GrantTypes): Array<Grant> {
		return [...this.values()].filter((grant) => grant.level === level && grant.type === grantType);
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
			// @ts-expect-error
			'system.grants': _del,
		});

		// @ts-expect-error
		await this.#item.update({ 'system.grants': {} });
	}

	async duplicate(id: string) {
		const newGrant = foundry.utils.deepClone(this.#item.system.grants?.[id] ?? {});
		// @ts-expect-error
		newGrant.name = `${newGrant.name} (Copy)`;

		await this.#item.update({
			// @ts-expect-error
			'system.grants': {
				...this.#item.system.grants,
				[foundry.utils.randomID()]: newGrant,
			},
		});
	}

	// @ts-expect-error
	override async delete(id: string): Promise<void> {
		super.delete(id);

		await this.#item.update({
			// @ts-expect-error
			'system.grants': {
				[`${id}`]: _del,
			},
		});

		const actor = this.#item.parent;
		if (actor?.documentName !== 'Actor') return;

		actor.grants.removeGrant(id);
	}

	/** ************************************************
	 *                Static methods
	 * ************************************************ */
	static async addGrant(item: any, data = {}, update = true, returnId = false) {
		// @ts-expect-error
		const newGrant: Grant = foundry.utils.mergeObject(
			{
				type: 'skill',
				level: 1,
				levelType: ['class', 'archetype'].includes(item.type) ? 'class' : 'character',
			},
			data,
		);

		const id = foundry.utils.randomID();
		newGrant.id = id;

		const updateData = {
			'system.grants': {
				...item.system.grants,
				[id]: newGrant,
			},
		};

		if (update) await item.update(updateData);
		if (returnId) return [id, updateData];
		return updateData;
	}
}
