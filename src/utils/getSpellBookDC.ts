export default function getSpellBookDC(
	actor: Actor.OfType<'base'>,
	item: Item.OfType<'spell'>,
): number {
	let spellBook: any; // TODO: Types - Update this

	const actorData: any = actor.system;
	const spellBookId = item.system.spellBook;

	if (spellBookId) spellBook = actor.system.spellBooks[spellBookId];

	if (!spellBook) return actorData.attributes.spellDC ?? 8;
	return spellBook.stats.dc ?? 8;
}
