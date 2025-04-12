// import { DynMapReducer } from '#runtime/svelte/store/reducer';

export default class SpellMapReducer extends DynMapReducer {
  initialize() {
    this.filters.add((item) => item.type === "spell");

    this.sort.set((a, b) => a.sort - b.sort);

    this._books = {};
    const actor = [...this.data]?.[0]?.parent;
    if (!actor) return;

    this._books.none = this.derived.create("none");
    [...actor.spellBooks.keys()].forEach((key) => {
      this._books[key] ??= this.derived.create(key);
    });

    Object.entries(this._books).forEach(([bookId, bookReducer]) => {
      bookReducer.filters.add((item) => {
        const id = item.system.spellBook ? item.system.spellBook : "none";
        return id === bookId;
      });

      bookReducer._levels = {};

      Object.keys(CONFIG.A5E.spellLevels).forEach((key) => {
        bookReducer._levels[key] = bookReducer.derived.create(key);
      });

      Object.entries(bookReducer._levels).forEach(([key, reducer]) => {
        reducer.filters.add(
          (item) => parseInt(item.system.level, 10) === parseInt(key, 10),
        );
      });
    });
  }
}
