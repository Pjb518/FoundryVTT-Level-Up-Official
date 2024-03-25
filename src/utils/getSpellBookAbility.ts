export default function getSpellBookAbility(
  actor: typeof Actor,
  item: typeof Item
): string {
  let spellBook: any;

  const actorData: any = actor.system;
  const spellBookId = item.system.spellBook;

  if (spellBookId) spellBook = actor.spellBooks.get(item.system.spellBook);
  else spellBook = actor.spellBooks.default;

  if (!spellBook) return actorData.attributes.spellcasting ?? 'int';
  if (spellBook.stats.ability === 'default') return actorData.attributes.spellcasting ?? 'int';

  return spellBook.stats.ability || 'int';
}
