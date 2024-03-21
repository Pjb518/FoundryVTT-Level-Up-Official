import type { SpellBookData } from 'types/spellBook';
import SpellBook from '../dataModels/actor/SpellBook';

export default class SpellBookManager extends Map<string, SpellBook> {
  private actor: typeof Actor;

  default: SpellBook | null;

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

    // If only one spell book exists, set it as the default
    if (this.size === 1) {
      const defaultSpellBook: SpellBook = this.values().next().value;
      if (!defaultSpellBook.default) defaultSpellBook.updateSource({ default: true });
    }

    this.default = [...this.values()].find((spellBook: SpellBook) => spellBook.default) ?? null;
  }

  async add(data: SpellBookData) {
    const id = data?._id ?? foundry.utils.randomID();

    await this.actor.update({
      [`system.spellBooks.${id}`]: data
    });

    return this.get(id);
  }

  remove(id: string) {
    const spellBook = this.get(id);
    if (!spellBook) return;

    spellBook.delete();
  }

  getRollData(): Record<string, any> {
    const data: Record<string, any> = {};

    this.forEach((spellBook: SpellBook) => {
      Object.assign(data, spellBook.getRollData());
    });

    // Add the default spell book
    const defaultSpellBook = this.default;
    if (defaultSpellBook) {
      Object.assign(data, defaultSpellBook.getRollData('spellbook-default'));
    }

    return data;
  }
}
