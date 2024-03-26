import type { SpellBookData } from 'types/spellBook';
import SpellBook from '../dataModels/actor/SpellBook';

export default class SpellBookManager extends Map<string, SpellBook> {
  private actor: typeof Actor;

  default: SpellBook | null = null;

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

        // Set the default spell book
        if (data.default) this.default = spellBook;
      });

    // If only one spell book exists, set it as the default
    if (this.size === 1 && !this.default) {
      const defaultSpellBook: SpellBook = this.values().next().value;
      if (!defaultSpellBook.default) defaultSpellBook.updateSource({ default: true });
    }
  }

  async add(data: SpellBookData) {
    const id = data?._id ?? foundry.utils.randomID();

    await this.actor.update({
      [`system.spellBooks.${id}`]: data
    });

    return id;
  }

  async setDefault(id: string): Promise<boolean> {
    const spellBook = this.get(id);
    if (!spellBook) return false;

    const updates = {};
    this.forEach((sb: SpellBook) => {
      updates[`system.spellBooks.${sb._id}.default`] = sb._id === id;
    });

    await this.actor.update(updates);
    return true;
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
