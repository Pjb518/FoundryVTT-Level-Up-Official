import { Currency, type CurrencyDenomination } from '#documents/item/Currency.ts';

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
		let result = new Currency(this.currency.toObject());

		this.actor.itemTypes.object.forEach((i) => {
			if (i.system.objectType !== 'container') return;

			result = result.plus(i.system.currency ?? {});
		});

		return result;
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

	/** Add currency to the actor */
	async addCurrency(currency: Partial<Record<CurrencyDenomination, number>>) {
		const result = this.currency.plus(currency);

		this.actor.update({
			system: { currency: result.toObject() },
		});
	}

	/** Remove currency for actor and containers */
	async removeCurrency(currency: Partial<Record<CurrencyDenomination, number>>) {
		const availableCoins = this.allCurrency;
		const toRemove = new Currency(currency).copperValue;
		if (toRemove > availableCoins.copperValue) return false;

		return true;
	}

	/** Find a stackable item in the inventory */
	findStackableItem(
		item: Item.OfType<'object'>,
		{ containerId = null }: { containerId?: string | null } = {},
	) {
		const testItem = item.clone();
		if (!testItem.isType('object')) return null;

		const candidates = this.filter(
			(i) =>
				(containerId ? i.system.containerId === containerId : !i.system.containerId) &&
				i.isStackableWith(item),
		);

		if (candidates.length > 1) {
			// Prefer stacking with unequipped items
			const notEquipped = candidates.filter((item) => [0, 1].includes(item.system.equippedState));
			return notEquipped.length > 0 ? notEquipped[0] : candidates[0];
		}

		return candidates.at(0) ?? 0;
	}
}

export { ActorInventory };
