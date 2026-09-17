import { getDeterministicBonus } from '../../dice/getDeterministicBonus.ts';
import HitDiceManager from '../../managers/HitDiceManager.ts';
import { BaseActorA5e } from './base.svelte.ts';

export default class CharacterActorA5E extends BaseActorA5e<'character'> {
	declare automationAvailable: boolean;

	declare _classes: Record<string, Item.OfType<'class'>> | undefined;

	declare levels: { character: number; classes: Record<string, number> };

	declare classAutomationFlags: Record<string, boolean>;
}
