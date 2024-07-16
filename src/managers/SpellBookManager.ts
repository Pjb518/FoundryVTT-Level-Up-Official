import type { SpellBookData } from 'types/spellBook';
import type { BaseActorA5e } from '../documents/actor/base';

import SpellBook from '../dataModels/actor/SpellBook';

export default class SpellBookManager extends Map<string, SpellBook> {
  private actor: BaseActorA5e;

  constructor(actor: BaseActorA5e) {
    super();

    this.actor = actor;

    // Initialize the spell books
    const spellBookData: SpellBookData = this.actor.system.spellBooks ?? {};
    Object.entries(spellBookData ?? {})
      .forEach(([id, data]: [string, SpellBookData]) => {
        const spellBook = new SpellBook(data, { parent: this.actor });
        spellBook._id = id;
        this.set(id, spellBook);

        // Make a reference to the spell book on the actor.
        // TODO: Note: This might be unstable, needs further testing.
        this.actor.system.spellBooks[id] = spellBook;
      });
  }

  async add(data: SpellBookData) {
    const id = data?._id ?? foundry.utils.randomID();

    await this.actor.update({
      [`system.spellBooks.${id}`]: data
    });

    return id;
  }

  remove(id: string) {
    const spellBook = this.get(id);
    if (!spellBook) return;

    spellBook.delete();
  }

  removeAll() {
    this.forEach((spellBook: SpellBook) => spellBook.delete());
  }

  first() {
    return this.values().next().value;
  }

  getSpellDCString(returnIfSingle = false) {
    if (this.size <= 1 && returnIfSingle) return '';

    const spellBooks = [...this.values()];

    return spellBooks.map((s) => {
      const { dc, ability } = s.stats;

      return `${s.name} ( ${dc} ${ability.capitalize()} )`;
    }).join(', ');
  }
}
