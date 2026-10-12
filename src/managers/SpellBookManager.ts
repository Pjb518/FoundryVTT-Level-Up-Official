import { SpellBook } from '../dataModels/actor/SpellBook.ts';

export default class SpellBookManager extends Map<string, SpellBook> {
	private actor: Creature;

	// @ts-expect-error
	#default: SpellBook = null;

	constructor(actor: Creature) {
		super();

		this.actor = actor;

		// Initialize the spell books
		const spellBookData: Record<string, SpellBook.Data> = this.actor.system.spellBooks ?? {};

		Object.entries(spellBookData).forEach(([id, data]) => {
			const spellBook = new SpellBook(
				{ ...foundry.utils.deepClone(data), _id: id },
				{ parent: this.actor },
			);

			this.set(id, spellBook);
			if (spellBook.default) this.#default = spellBook;

			// Make a reference to the spell book on the actor.
			// TODO: Note: This might be unstable, needs further testing.
			this.actor.system.spellBooks[id] = spellBook;
		});
	}

	// ======================================
	// Getters
	// ======================================

	/** Gets default spell book */
	get default(): SpellBook | undefined {
		return this.#default ?? this.first();
	}

	/** Gets all the spells from all the books */
	get spells(): Item.OfType<'spell'>[] {
		return [...this.values()].flatMap((spellBook) => [...spellBook.spells.values()]);
	}

	// ======================================
	// API Methods
	// ======================================

	/** Add a spellbook  */
	async add(data: Partial<SpellBook.Data> = {}) {
		const id = data?._id ?? foundry.utils.randomID();

		// The first spell book on an actor is always the default.
		const isDefault = this.size === 0 ? true : (data.default ?? false);

		await this.actor.update({
			[`system.spellBooks.${id}`]: { ...data, _id: id, default: isDefault },
		});

		return id;
	}

	/** Remove a spellbook */
	async remove(id: string) {
		const spellBook = this.get(id);
		if (!spellBook) return;

		await spellBook.delete();
	}

	/** Remove all spell books */
	removeAll() {
		this.forEach((spellBook: SpellBook) => {
			spellBook.delete();
		});
	}

	/** Get the first spell book */
	first() {
		return this.values().next().value;
	}

	/** Get spell save dcs as a string */
	getSpellDCString(returnIfSingle = false) {
		if (this.size <= 1 && returnIfSingle) return '';

		const spellBooks = [...this.values()];

		return spellBooks
			.map((s) => {
				const { dc, ability } = s.stats;

				return `${s.name} ( ${dc} ${ability.capitalize()} )`;
			})
			.join(', ');
	}
}
