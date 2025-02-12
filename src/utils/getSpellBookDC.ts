import type { BaseActorA5e } from '../documents/actor/base';
import type SpellItemA5e from '../documents/item/spell';

export default function getSpellBookDC(actor: BaseActorA5e, item: SpellItemA5e): number {
	let spellBook: any; // TODO: Types - Update this

	const actorData: any = actor.system;
	const spellBookId = item.system.spellBook;

	if (spellBookId) spellBook = actor.spellBooks.get(item.system.spellBook);

	if (!spellBook) return actorData.attributes.spellDC ?? 8;
	return spellBook.stats.dc ?? 8;
}
