import type { SpellBookData } from 'types/spellBook';
import SpellBook from '../dataModels/actor/SpellBook';

export default class SpellBookManager extends Map<string, SpellBook> {
  private actor: typeof Actor;

  constructor(actor: typeof Actor) {
    super();

    this.actor = actor;

    // Initialize the spell books
    const spellBookData: SpellBookData = this.actor.system.spellBooks ?? {};
    Object.entries(spellBookData ?? {})
      .forEach(([id, data]: [string, SpellBookData]) => {
        data._id = id;
        const spellBook = new SpellBook(data, { parent: this.actor });
        this.set(id, spellBook);
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
}
