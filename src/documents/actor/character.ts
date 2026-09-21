import { getDeterministicBonus } from '../../dice/getDeterministicBonus.ts';
import HitDiceManager from '../../managers/HitDiceManager.ts';
import { ActorA5E } from './actor.svelte.ts';

export default class CharacterActorA5E extends ActorA5E<'character'> {
	declare automationAvailable: boolean;

	declare _classes: Record<string, Item.OfType<'class'>> | undefined;

	declare levels: { character: number; classes: Record<string, number> };

	declare classAutomationFlags: Record<string, boolean>;
}
