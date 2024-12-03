import type { A5EFeatureData } from '../../dataModels/item/FeatureDataModel';

import { ItemA5e } from './item';

import ItemGrantsManager from '../../managers/ItemGrantsManager';

export default class FeatureItemA5e extends ItemA5e {
	declare grants: ItemGrantsManager;

	declare system: InstanceType<typeof A5EFeatureData>;

	override prepareBaseData() {
		super.prepareBaseData();

		// Setup Grants system
		this.grants = new ItemGrantsManager(this);
	}

	override async _preCreate(data, options, user) {
		if (user._id !== game.userId) {
			await super._preCreate(data, options, user);
			return;
		}

		// Apply grants if any
		if (this.parent && this.parent.documentName === 'Actor') {
			const actor = this.parent;
			// Keep id of the original document
			options.keepId = true;
			// @ts-expect-error
			if (!options.noGrant) actor.grants.createInitialGrants(this, true);
		}

		super._preCreate(data, options, user);
	}

	override _onCreate(data, options, userId) {
		super._onCreate(data, options, userId);
	}

	override async _onDelete(options, userId) {
		super._onDelete(options, userId);

		if (!this.parent || this.parent?.documentName !== 'Actor') return;

		const actor = this.parent;
		await actor.grants.removeGrantsByItem(this.uuid);
	}
}
