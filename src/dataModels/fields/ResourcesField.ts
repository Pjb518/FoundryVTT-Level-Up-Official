import { getDeterministicBonus } from '../../dice/getDeterministicBonus.ts';

import DataModel = foundry.abstract.DataModel;
import fields = foundry.data.fields;

// ======================================================
//                        Schemas
// ======================================================
const TYPE_OPTS = { required: true, nullable: false, blank: false };

const baseSchema = () => ({
	name: new fields.StringField({ required: true, nullable: false, initial: '' }),
	slug: new fields.StringField({ required: true, nullable: false, initial: '' }),
	per: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'longRest',
		choices: () => CONFIG.A5E.resourceRecoveryOptions,
	}),
});

const counterSchema = () => ({
	value: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
	type: new fields.StringField({ ...TYPE_OPTS, initial: 'counter' }),
	...baseSchema(),
});

const diceSchema = () => ({
	size: new fields.StringField({ required: true, nullable: false, initial: 1 }),
	denom: new fields.StringField({ required: true, nullable: false, initial: 1 }),
	modifiers: new fields.SetField(
		new fields.StringField({ required: true, nullable: false, initial: '' }),
		{ required: true, nullable: false },
	),
	value: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
	max: new fields.StringField({ required: true, nullable: false, initial: '' }),
	consumeType: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'none',
		choices: { none: 'None', pool: 'Pool' },
	}),
	type: new fields.StringField({ ...TYPE_OPTS, initial: 'dice' }),
	...baseSchema(),
});

const itemSchema = () => ({
	itemId: new fields.StringField({ required: true, nullable: false, initial: '' }),
	consumeType: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'uses',
		choices: { quantity: 'Quantity', uses: 'Uses' },
	}),
	type: new fields.StringField({ ...TYPE_OPTS, initial: 'item' }),
	...baseSchema(),
});

const usesSchema = () => ({
	value: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
	max: new fields.StringField({ required: true, nullable: false, initial: '' }),
	type: new fields.StringField({ ...TYPE_OPTS, initial: 'uses' }),
	...baseSchema(),
});

// ======================================================
//                       NameSpaces
// ======================================================
declare namespace CounterResource {
	type Schema = DataSchema & ReturnType<typeof counterSchema>;
}

declare namespace DiceResource {
	type Schema = DataSchema & ReturnType<typeof diceSchema>;
}

declare namespace ItemResource {
	type Schema = DataSchema & ReturnType<typeof itemSchema>;
}

declare namespace UsesResource {
	type Schema = DataSchema & ReturnType<typeof usesSchema>;
}

// ======================================================
//                        Classes
// ======================================================
/** Data model encapsulation for Counter Resource */
class CounterResource extends DataModel<CounterResource.Schema> {
	static type = 'counter';

	static override defineSchema(): CounterResource.Schema {
		return { ...counterSchema() };
	}

	/** Logic to apply when using this resource */
	useResource(update = true) {
		const actor = this.getNearestDocument() as Actor.Implementation;
		if (actor?.documentName !== 'Actor') return;

		const { value } = this;
		const slug = this.slug || this.name.slugify({ strict: true });

		const newValue = value + 1;

		const data = {
			[`system.resources.${slug}.value`]: newValue,
		};

		if (update) return actor.update(data);
		return data;
	}

	/** Logic to apply when using this resource */
	resetResource(update = true) {
		const actor = this.getNearestDocument() as Actor.Implementation;
		if (actor?.documentName !== 'Actor') return;

		const slug = this.slug || this.name.slugify({ strict: true });

		const data = {
			[`system.resources.${slug}.value`]: 0,
		};

		if (update) return actor.update(data);
		return data;
	}
}

/** Data model encapsulation for Dice Resource */
class DiceResource extends DataModel<DiceResource.Schema> {
	static type = 'dice';

	static override defineSchema(): DiceResource.Schema {
		return { ...diceSchema() };
	}

	/** Logic to apply when using this resource */
	useResource(update = true) {
		const actor = this.getNearestDocument() as Actor.Implementation;
		if (actor?.documentName !== 'Actor') return;

		const { value } = this;
		const slug = this.slug || this.name.slugify({ strict: true });
	}

	/** Logic to apply when using this resource */
	resetResource(update = true) {
		const actor = this.getNearestDocument() as Actor.Implementation;
		if (actor?.documentName !== 'Actor') return;

		const { value } = this;
		const slug = this.slug || this.name.slugify({ strict: true });
	}
}

/** Data model encapsulation for Item Resource */
class ItemResource extends DataModel<ItemResource.Schema> {
	static type = 'item';

	static override defineSchema(): ItemResource.Schema {
		return { ...itemSchema() };
	}

	/** Logic to apply when using this resource */
	useResource(update = true) {
		const actor = this.getNearestDocument() as Actor.Implementation;
		if (actor?.documentName !== 'Actor') return;

		const { itemId, consumeType } = this;

		const item = actor.items.get(itemId);
		if (!item) return null;

		const property = consumeType === 'quantity' ? 'system.quantity' : 'system.uses.value';
		let newValue = consumeType === 'quantity' ? item.system.quantity : item.system.uses?.value;
		newValue = Math.max((newValue ?? 0) - 1, 0);

		const data = { [property]: newValue };

		if (update) return item.update(data);
		return item.update(data);
	}

	/** Logic to apply when using this resource */
	resetResource(update = true) {
		if (update) return null;
		return {};
	}
}

/** Data model encapsulation for Uses Resource */
class UsesResource extends DataModel<UsesResource.Schema> {
	static type = 'uses';

	static override defineSchema(): UsesResource.Schema {
		return { ...usesSchema() };
	}

	/** Logic to apply when using this resource */
	useResource(update = true) {
		const actor = this.getNearestDocument() as Actor.Implementation;
		if (actor?.documentName !== 'Actor') return;

		const { value } = this;
		const slug = this.slug || this.name.slugify({ strict: true });

		const newValue = Math.max(value - 1, 0);
		const data = {
			[`system.resources.${slug}.value`]: newValue,
		};

		if (update) return actor.update(data);
		return data;
	}

	/** Logic to apply when using this resource */
	resetResource(update = true) {
		const actor = this.getNearestDocument() as Actor.Implementation;
		if (actor?.documentName !== 'Actor') return;

		const { max } = this;
		const slug = this.slug || this.name.slugify({ strict: true });

		const newValue = getDeterministicBonus(max, actor.getRollData());
		const data = {
			[`system.resources.${slug}.value`]: newValue,
		};

		if (update) return actor.update(data);
		return data;
	}
}

// ======================================================
//                        Exports
// ======================================================
export const RESOURCE_DATA_TYPES = {
	counter: CounterResource,
	dice: DiceResource,
	item: ItemResource,
	uses: UsesResource,
};

export type ResourceTypes = keyof typeof RESOURCE_DATA_TYPES;
export type Resource<T extends ResourceTypes = ResourceTypes> = Extract<
	Actor.OfType<'character'>['system']['resources'][string],
	{ type: T }
>;
