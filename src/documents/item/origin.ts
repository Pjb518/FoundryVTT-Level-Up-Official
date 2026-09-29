import { ItemGrantsManager } from '../../managers/ItemGrantsManager.ts';
import { BaseItemA5e } from './base.svelte.ts';

export default class OriginItemA5e<
	SubType extends Item.SubType = Item.SubType,
> extends BaseItemA5e<SubType> {
	declare grants: ItemGrantsManager;

	override prepareBaseData() {
		super.prepareBaseData();

		// Setup Grants System
		this.grants = new ItemGrantsManager(this);
	}

	override async _preCreate(data, options, user): Promise<boolean | void> {
		return super._preCreate(data, options, user);
	}

	override async _onCreate(data, options, userId) {
		super._onCreate(data, options, userId);

		if (userId !== game.userId) {
			return;
		}

		// Apply grants if any
		if (this.parent && this.parent.documentName === 'Actor') {
			const actor = this.parent;
			// Keep id of the original document
			options.keepId = true;
			if (!options.noGrant) actor.grants.createInitialGrants(this, false);
		}
	}

	override async _onDelete(options, userId) {
		super._onDelete(options, userId);

		if (!this.parent || this.parent?.documentName !== 'Actor') return;

		const actor = this.parent;
		await actor.grants.removeGrantsByItem(this);
	}
}
