import { getDeterministicBonus } from '../../dice/getDeterministicBonus.ts';

import DataModel = foundry.abstract.DataModel;
import fields = foundry.data.fields;

// ======================================================
//                        Schemas
// ======================================================
const TYPE_OPTS = { required: true, nullable: false, blank: false };

const baseSchema = () => ({
	name: new fields.StringField({ required: true, nullable: false, initial: 'New Resource' }),
	slug: new fields.StringField({ required: true, nullable: false, initial: '' }),
	per: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'longRest',
		choices: () => CONFIG.A5E.resourceRecoveryOptions,
	}),
	grantedBy: new fields.StringField({
		persisted: false,
		required: true,
		nullable: false,
		initial: '',
	}),
});

const counterSchema = () => ({
	value: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
	type: new fields.StringField({ ...TYPE_OPTS, initial: 'counter' }),
	...baseSchema(),
});

const diceSchema = () => ({
	size: new fields.NumberField({ required: true, nullable: false, initial: 1 }),
	denom: new fields.NumberField({ required: true, nullable: false, initial: 4 }),
	modifiers: new fields.SetField(
		new fields.StringField({ required: true, nullable: false, initial: '' }),
		{ required: true, nullable: false },
	),
	defaultDie: new fields.SchemaField({
		size: new fields.NumberField({ required: true, nullable: false, initial: 1 }),
		denom: new fields.NumberField({ required: true, nullable: false, initial: 4 }),
	}),
	value: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
	max: new fields.StringField({ required: true, nullable: false, initial: '' }),
	consumeType: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'none',
		choices: () => CONFIG.A5E.diceResourceConsumeType,
	}),
	useType: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'decrement',
		choices: () => CONFIG.A5E.diceResourceUseType,
	}),
	type: new fields.StringField({ ...TYPE_OPTS, initial: 'dice' }),
	...baseSchema(),
});

const itemSchema = () => ({
	itemId: new fields.StringField({ required: true, nullable: false, initial: '' }),
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
	useResource({ quantity = 1, update = true } = {}) {
		const actor = this.getNearestDocument() as Actor.Implementation;
		if (actor?.documentName !== 'Actor') return;

		const { value } = this;
		const slug = this.slug || this.name.slugify({ strict: true });

		const newValue = value + quantity;

		const data = {
			[`system.resources.${slug}.value`]: newValue,
		};

		if (update) actor.update(data);
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

		if (update) actor.update(data);
		return { data, recovered: this.value === 0 };
	}
}

/** Data model encapsulation for Dice Resource */
class DiceResource extends DataModel<DiceResource.Schema> {
	static type = 'dice';

	static override defineSchema(): DiceResource.Schema {
		return { ...diceSchema() };
	}

	getFormula(quantity = 1): string {
		if (this.consumeType === 'none') {
			return `${this.size}d${this.denom}${this.modifiers.size > 0 ? `${[...this.modifiers].join('')}` : ''}`;
		}

		return `${quantity}d${this.denom}${this.modifiers.size > 0 ? `${[...this.modifiers].join('')}` : ''}`;
	}

	/** Logic to apply when using this resource */
	useResource({ quantity = 1, update = true, rollDice = true } = {}) {
		const actor = this.getNearestDocument() as Actor.Implementation;
		if (actor?.documentName !== 'Actor') return;

		const { consumeType, denom, size, useType, value } = this;
		const slug = this.slug || this.name.slugify({ strict: true });

		const updates: Record<string, any> = {};

		// If consume type is none decrement value
		if (consumeType === 'none') {
			const newValue = Math.max(value - quantity, 0);
			updates.value = newValue;
		} else if (consumeType === 'number') {
			const newValue = useType === 'decrement' ? Math.max(size - quantity, 0) : size + quantity;
			updates.size = newValue;
		} else if (consumeType === 'size') {
			// @ts-expect-error
			const faceIdx = CONFIG.A5E.DICE_SIDES.indexOf(denom || 0);
			const newValue =
				useType === 'decrement'
					? Math.max(faceIdx - quantity, 0)
					: Math.min(faceIdx + quantity, CONFIG.A5E.DICE_SIDES.length - 1);
			updates.denom = CONFIG.A5E.DICE_SIDES[newValue];
		}

		// Roll Dice
		if (rollDice) {
			const roll = new Roll(this.getFormula(quantity), actor.getRollData());
			roll.toMessage({ flavor: `${this.name} Roll` });
		}

		if (update) {
			actor.update({ [`system.resources.${slug}`]: updates });
		}

		return { [`system.resources.${slug}`]: updates };
	}

	/** Logic to apply when using this resource */
	resetResource(update = true) {
		const actor = this.getNearestDocument() as Actor.Implementation;
		if (actor?.documentName !== 'Actor') return;

		const { consumeType, defaultDie } = this;
		const slug = this.slug || this.name.slugify({ strict: true });

		const updates: Record<string, any> = {};
		let restored = 0;

		if (consumeType === 'none') {
			updates.value = getDeterministicBonus(this.max, actor.getRollData());
			restored = updates.value - this.value;
		} else if (consumeType === 'number') {
			updates.size = defaultDie.size;
			restored = updates.size - this.size;
		} else if (consumeType === 'size') {
			updates.denom = defaultDie.denom;
			restored = updates.denom - this.denom ? 1 : 0;
		}

		if (update) actor.update({ [`system.resources.${slug}`]: updates });
		return { data: { [`system.resources.${slug}`]: updates }, restored };
	}
}

/** Data model encapsulation for Item Resource */
class ItemResource extends DataModel<ItemResource.Schema> {
	static type = 'item';

	static override defineSchema(): ItemResource.Schema {
		return { ...itemSchema() };
	}

	/** Logic to apply when using this resource */
	useResource({ quantity = 1, update = true } = {}) {
		const actor = this.getNearestDocument() as Actor.Implementation;
		if (actor?.documentName !== 'Actor') return;

		const { itemId } = this;

		const item = actor.items.get(itemId);
		if (!item) return null;

		let newValue = item.system.uses?.value;
		newValue = Math.max((newValue ?? 0) - quantity, 0);

		const data = { 'item.system.uses.value': newValue };

		// @ts-expect-error
		item.update(data);
	}

	/** Logic to apply when using this resource */
	resetResource(update = true) {
		if (update) {
		}
		return { data: {}, recovered: 0 };
	}
}

/** Data model encapsulation for Uses Resource */
class UsesResource extends DataModel<UsesResource.Schema> {
	static type = 'uses';

	static override defineSchema(): UsesResource.Schema {
		return { ...usesSchema() };
	}

	/** Logic to apply when using this resource */
	useResource({ quantity = 1, update = true }) {
		const actor = this.getNearestDocument() as Actor.Implementation;
		if (actor?.documentName !== 'Actor') return;

		const { value } = this;
		const slug = this.slug || this.name.slugify({ strict: true });

		const newValue = Math.max(value - quantity, 0);
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

		const { value, max } = this;
		const slug = this.slug || this.name.slugify({ strict: true });

		const newValue = getDeterministicBonus(max, actor.getRollData());
		const data = {
			[`system.resources.${slug}.value`]: newValue,
		};

		if (update) actor.update(data);
		return { data, recovered: newValue - value };
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
