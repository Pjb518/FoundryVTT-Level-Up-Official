import { Currency } from '#documents/item/Currency.ts';

class ActorInventory extends foundry.utils.Collection<Item.OfType<'object'>> {
	/** Reference to parent actor */
	actor: Actor.Implementation;

	/** Reference to currency */
	currency: Currency;

	constructor(actor: Actor.Implementation, entries?: Item.OfType<'object'>[]) {
		// @ts-expect-error
		super(entries?.map((entry) => [entry.id, entry]));

		this.actor = actor;
		//
		// @ts-expect-error
		this.currency = new Currency(this.actor.system.currency);
	}

	/** ---------------------------------- */
	// Getters
	/** ---------------------------------- */

	/** Get currency available on actor and items */
	get allCurrency() {
		return 0;
	}

	/** Get total wealth of the actor */
	get totalWealth() {
		return 0;
	}

	/** Get a list of all attuned items on the actor */
	get attuned() {
		return this.filter((i) => i.system.attuned);
	}

	/** ---------------------------------- */
	// Helper Methods
	/** ---------------------------------- */
	findStackableItem(
		item: Item.OfType<'object'>,
		{ containerId = null }: { containerId?: string | null } = {},
	) {
		const testItem = item.clone();

		if (!testItem.isType('object')) return null;
		// TODO:
	}
}

export { ActorInventory };
