import { ContainerManager } from '../../managers/ContainerManager.ts';
import { ItemA5e } from './item.ts';

export default class ObjectItemA5e extends ItemA5e<'object'> {
	declare containerItems: ContainerManager | null;

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
	override async duplicateItem() {
		if (this.system.objectType !== 'container') return super.duplicateItem();

		if (!this.actor) return null;
		const container = await ContainerManager.createContainerOnActor(this.parent, this);
		return container;
	}
}
