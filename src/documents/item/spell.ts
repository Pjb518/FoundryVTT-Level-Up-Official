import type { A5ESpellData } from '../../dataModels/item/SpellDataModel';

import { ItemA5e } from './item';

export default class SpellItemA5e extends ItemA5e {
	declare system: InstanceType<typeof A5ESpellData>;

	get spellBook() {
		return this.system.spellBook;
	}

	async togglePrepared() {
		if (!(this.type === 'spell') || !this.actor) return;

		const currentState = Number(this.system.prepared);
		const newState = (currentState + 1) % 3;

		await this.update({
			'system.prepared': newState,
		});
	}

	// eslint-disable-next-line consistent-return
	override async _preCreate(data, options, user): Promise<boolean | void> {
		if (!data.system?.spellBook && this.parent?.documentName === 'Actor') {
			ui.notifications?.error('You must select a spell book to create a spell.');
			return false;
		}

		super._preCreate(data, options, user);
	}
}
