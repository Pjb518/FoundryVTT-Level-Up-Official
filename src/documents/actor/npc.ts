import HitDiceManager from '../../managers/HitDiceManager.ts';
import { BaseActorA5e } from './base.svelte.ts';

export default class NPCActorA5E extends BaseActorA5e<'npc'> {
	// -------------------------------------------------------------
	// Sheet Toggles
	// -------------------------------------------------------------

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
	}

	/** @inheritdoc */
	override _onUpdate(changed, options, userId) {
		super._onUpdate(changed, options, userId);
	}
}
