import type { BaseActorA5e } from '../documents/actor/base.svelte.ts';

export default function getSpellBookAbility(
	actor: BaseActorA5e,
	item: Item.OfType<'spell'>,
): string {
	let spellBook: any; // TODO: Types - Update this

	const actorData: any = actor.system;
	const spellBookId = item.system.spellBook;

	if (spellBookId) spellBook = actor.spellBooks.get(item.system.spellBook);

	if (!spellBook) return actorData.attributes.spellcasting ?? 'int';
	if (spellBook.stats.ability === 'default') return actorData.attributes.spellcasting ?? 'int';

	return spellBook.stats.ability || 'int';
}
