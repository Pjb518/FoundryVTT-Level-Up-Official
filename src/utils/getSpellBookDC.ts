export default function getSpellBookDC(actor: typeof Actor, item: typeof Item): number {
  let spellBook: any;

  const actorData: any = actor.system;
  const spellBookId = item.system.spellBook;

  if (spellBookId) spellBook = actor.spellBooks.get(item.system.spellBook);
  else spellBook = actor.spellBooks.default;

  if (!spellBook) return actorData.attributes.spellDC ?? 8;
  return spellBook.stats.dc ?? 8;
}
