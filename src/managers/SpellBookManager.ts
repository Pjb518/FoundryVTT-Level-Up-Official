import { SpellBook } from '../dataModels/actor/SpellBook';
import type { ActorA5E } from '../documents/actor/actor';
import type SpellItemA5e from '../documents/item/spell';

export default class SpellBookManager extends Map<string, SpellBook> {
	private actor: Actor.OfType<'character'>;

	constructor(actor: ActorA5E) {
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

			// Make a reference to the spell book on the actor.
			// TODO: Note: This might be unstable, needs further testing.
			this.actor.system.spellBooks[id] = spellBook;
		});
	}

	// ======================================
	// Getters
	// ======================================

	get default(): SpellBook | undefined {
		return [...this.values()].find((spellBook) => spellBook.default) ?? this.first();
	}

	get spells(): SpellItemA5e[] {
		return [...this.values()].flatMap((spellBook) => [...spellBook.spells.values()]);
	}

	// ======================================
	// API Methods
	// ======================================

	async add(data: Partial<SpellBook.Data> = {}) {
		const id = data?._id ?? foundry.utils.randomID();

		// The first spell book on an actor is always the default.
		const isDefault = this.size === 0 ? true : (data.default ?? false);

		await this.actor.update({
			[`system.spellBooks.${id}`]: { ...data, _id: id, default: isDefault },
		});

		return id;
	}

	async remove(id: string) {
		const spellBook = this.get(id);
		if (!spellBook) return;

		await spellBook.delete();
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

		return spellBooks
			.map((s) => {
				const { dc, ability } = s.stats;

				return `${s.name} ( ${dc} ${ability.capitalize()} )`;
			})
			.join(', ');
	}
}
