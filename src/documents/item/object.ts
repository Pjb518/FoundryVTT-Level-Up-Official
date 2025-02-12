import type { A5EObjectData } from '../../dataModels/item/ObjectDataModel';

import { ItemA5e } from './item';

import ContainerManager from '../../managers/ContainerManager';

export default class ObjectItemA5e extends ItemA5e {
	declare containerItems: ContainerManager | null;

	declare system: InstanceType<typeof A5EObjectData>;

	get weight() {
		if (this.system.objectType === 'container') {
			const w = this.containerItems?.weight ?? 0;
			if (w instanceof Promise) return w.then((cw) => (cw ?? 0) + this.system.weight);

			return w + this.system.weight;
		}

		return this.system.weight;
	}

	get container() {
		if (!this.system.containerId) return null;
		if (this.isEmbedded) return this.actor.items.get(this.system.containerId);
		if (this.pack) return game.packs.get(this.pack)?.getDocument(this.system.containerId);
		return game.items.get(this.system.containerId);
	}

	// TODO: Container Rework - Add a solid fix at some point
	get containerItemNames() {
		if (!this.containerItems) return '';

		const names = ((this.containerItems.allItems as any[]) ?? []).map((i) => i.name);

		return names.join(', ');
	}

	get contents() {
		if (this.system.objectType !== 'container') return [];
		return this.containerItems?.items ?? [];
	}

	/** ------------------------------------------------------ */
	/**                      Data Prep                         */
	/** ------------------------------------------------------ */
	protected override _initialize(options?: Record<string, unknown>) {
		if (this.system?.objectType === 'container') {
			this.containerItems = null!;
		}

		super._initialize(options);
	}

	override prepareBaseData() {
		super.prepareBaseData();

		if (this.system.objectType === 'container') {
			this.containerItems = new ContainerManager(this);
		}
	}

	override prepareDerivedData() {
		super.prepareDerivedData();
	}

	override async duplicateItem() {
		if (this.system.objectType !== 'container') return super.duplicateItem();

		if (!this.actor) return null;
		const container = await ContainerManager.createContainerOnActor(this.parent, this);
		return container;
	}

	async toggleAttunement() {
		await this.update({
			'system.attuned': !this.system.attuned,
		});
	}

	async toggleDamagedState() {
		const currentState = this.system.damagedState;
		// @ts-expect-error
		const newState = (currentState + 1) % 3;

		await this.update({
			'system.damagedState': newState,
		});
	}

	async toggleEquippedState() {
		if (!this.actor) return;

		const currentState = this.system.equippedState;
		// @ts-expect-error
		let newState = (currentState + 1) % 3;

		// Check if armor is already equipped
		if (newState === CONFIG.A5E.EQUIPPED_STATES.EQUIPPED && this.system.objectType === 'armor') {
			const { hasArmor, hasUnderArmor } = this.actor.items.reduce(
				(acc, item) => {
					// @ts-expect-error
					if (
						item.system.equippedState !== CONFIG.A5E.EQUIPPED_STATES.EQUIPPED ||
						// @ts-expect-error
						item.system.objectType !== 'armor'
					)
						return acc;
					// @ts-expect-error
					const isUnderarmor = item.system.materialProperties.includes('underarmor');
					if (isUnderarmor) acc.hasUnderArmor = true;
					else acc.hasArmor = true;
					return acc;
				},
				{ hasArmor: false, hasUnderArmor: false },
			);

			const isUnderarmor = this.system.materialProperties.includes('underarmor');
			if (isUnderarmor && hasUnderArmor) newState = 0;
			else if (!isUnderarmor && hasArmor) newState = 0;

			// Warn user
			if (newState === 0) {
				// @ts-expect-error
				ui.notifications.warn(game.i18n.localize('A5E.armorClass.armorAlreadyEquipped'));
			}
		}

		// Check if 2 shields are already equipped
		if (newState === 2 && this.system.objectType === 'shield') {
			const shields = this.actor.items.filter(
				(i) =>
					// @ts-expect-error
					i.system.equippedState === CONFIG.A5E.EQUIPPED_STATES.EQUIPPED &&
					// @ts-expect-error
					i.system.objectType === 'shield',
			);
			if (shields.length >= 2) newState = 0;
			if (newState === 0) {
				// @ts-expect-error
				ui.notifications.warn(game.i18n.localize('A5E.armorClass.shieldAlreadyEquipped'));
			}
		}

		await this.update({
			'system.equippedState': newState,
		});
	}

	async toggleUnidentified() {
		await this.update({
			'system.unidentified': !this.system.unidentified,
		});
	}

	// TODO: Container Rework - Move to manager
	async updateContainer(containerUuid: string) {
		if (containerUuid === this.uuid) return;

		if (!containerUuid) {
			const container = (await fromUuid(this.system.containerId)) as InstanceType<
				typeof ObjectItemA5e
			> | null;
			if (!container) return;

			await this.update({ 'system.containerId': '' });
			await container.containerItems?.remove(this.uuid);
			return;
		}

		// Remove from old container
		const oldContainer = (await fromUuid(this.system.containerId)) as InstanceType<
			typeof ObjectItemA5e
		> | null;

		if (oldContainer) await oldContainer.containerItems?.remove(this.uuid);

		const container = (await fromUuid(containerUuid)) as InstanceType<typeof ObjectItemA5e> | null;
		if (
			!container ||
			container?.system?.objectType !== 'container' ||
			container?.parent?.id !== this.parent?.id
		)
			return;

		await this.update({ 'system.containerId': containerUuid });
		// TODO: Types - Fix this
		// @ts-expect-error
		await container.containerItems?.add(this.uuid);
	}

	override async _preCreate(data, options, user) {
		super._preCreate(data, options, user);
	}

	override async _preUpdate(data, options, user) {
		if (foundry.utils.getProperty(data, 'system.objectType')) await this._preUpdateObjectType();

		super._preUpdate(data, options, user);
	}

	async _preUpdateObjectType() {
		if (this.system.objectType !== 'container') return;

		const updates = {};
		const children = Object.entries(this.system.items ?? {});

		// eslint-disable-next-line no-restricted-syntax
		for await (const [key, item] of children) {
			updates[`system.items.-=${key}`] = null;

			const child = await fromUuid(item.uuid);
			if (!child) continue;

			await child.update({ 'system.containerId': '' });
		}

		await this.update(updates);
	}

	override async _onCreate(data, options, userId) {
		super._onCreate(data, options, userId);
		if (userId !== game.userId) return;

		if (this.system.objectType === 'container') {
			if (this.parent?.documentName === 'Actor') {
				await ContainerManager.createContainerOnActor(this.parent, this);
			} else if (this.pack) {
				// Do nothing
			} else {
				await ContainerManager.createContainerOnSidebar(this);
			}
		}

		// Clean containerId on object creation
		const container = await fromUuid(this.system.containerId);
		if (!container) await this.update({ 'system.containerId': '' });

		// Update quantity and quality consumers to set themselves as the target
		const updates = {};
		const actions = Object.entries(this.system.actions ?? {});
		actions.forEach(([actionId, action]) => {
			const consumers = Object.entries(action.consumers ?? {});
			consumers.forEach(([consumerId, consumer]) => {
				// @ts-expect-error
				if (consumer.type !== 'quantity' && consumer.type !== 'quality') return;
				updates[`system.actions.${actionId}.consumers.${consumerId}.itemId`] = this._id;
			});
		});

		await this.update(updates);
	}

	override async _onDelete(options, user) {
		// Clean up container
		if (!this.parent) return;
		if (this.system.objectType === 'container') {
			// eslint-disable-next-line no-undef
			const items = Object.values(this.system.items).map(({ uuid }) => fromUuidSync(uuid));
			const updates = items.map((i) => ({ _id: i?.id, 'system.containerId': '' }));
			await this.parent?.updateEmbeddedDocuments('Item', updates);
		}

		const container = (await fromUuid(this.system.containerId)) as InstanceType<
			typeof ObjectItemA5e
		> | null;

		if (container) await container?.containerItems?.delete(this.uuid);

		super._onDelete(options, user);
	}
}
