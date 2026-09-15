import { getDeterministicBonus } from '../../dice/getDeterministicBonus.ts';
import HitDiceManager from '../../managers/HitDiceManager.ts';
import { BaseActorA5e } from './base.svelte.ts';

export default class CharacterActorA5E extends BaseActorA5e<'character'> {
	declare automationAvailable: boolean;

	declare _classes: Record<string, Item.OfType<'class'>> | undefined;

	declare levels: { character: number; classes: Record<string, number> };

	declare classAutomationFlags: Record<string, boolean>;

	// -------------------------------------------------------------
	// Document Update Hooks
	// -------------------------------------------------------------
	/** @inheritdoc */
	override async _preCreate(data, options, user) {
		await super._preCreate(data, options, user);
	}

	/** @inheritdoc */
	override async _preUpdate(changed, options, userId) {
		await super._preUpdate(changed, options, userId);
	}

	/** @inheritdoc */
	override _onCreate(data, options, userId) {
		super._onCreate(data, options, userId);

		if (game.user.id !== userId) return;
		this._fixNestedUuids();
	}

	/** @inheritdoc */
	override _onUpdate(changed, options, userId) {
		super._onUpdate(changed, options, userId);
	}
}
