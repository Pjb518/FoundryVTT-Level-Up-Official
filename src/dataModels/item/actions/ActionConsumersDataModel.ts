import type { ItemA5e } from '../../../documents/item/item.ts';

import fields = foundry.data.fields;
import DataModel = foundry.abstract.DataModel;

import { getDeterministicBonus } from '../../../dice/getDeterministicBonus.ts';

// ======================================================
//                        Schemas
// ======================================================
const baseSchema = () => ({
	default: new fields.BooleanField({ required: true, nullable: false, initial: true }),
	label: new fields.StringField({ required: true, nullable: false, initial: '' }),
	id: new fields.StringField({ required: true, nullable: false, persisted: false }),
});

const usesSchema = () => ({
	quantity: new fields.NumberField({ required: true, nullable: false, initial: 1 }),
	type: new fields.StringField({ required: true, nullable: false, blank: false, initial: '' }),
	...baseSchema(),
});

const quantitySchema = () => ({
	itemId: new fields.StringField({ required: true, nullable: false, initial: '' }),
	quantity: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
	deleteOnZero: new fields.BooleanField({ required: true, nullable: false, initial: false }),
	type: new fields.StringField({ required: true, nullable: false, blank: false, initial: '' }),
	...baseSchema(),
});

const hitDiceSchema = () => ({
	quantity: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
	type: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		initial: 'hitDice',
	}),
	...baseSchema(),
});

const resourceSchema = () => ({
	classIdentifier: new fields.StringField({ required: true, nullable: false, initial: '' }),
	quantity: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
	resource: new fields.StringField({ required: true, nullable: false, initial: '' }),
	restore: new fields.BooleanField({ required: true, nullable: false, initial: false }),
	type: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		initial: 'resource',
	}),
	...baseSchema(),
});

const spellSchema = () => ({
	mode: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'variable',
		choices: ['variable', 'chargesOnly', 'inventionsOnly', 'slotsOnly', 'pointsOnly'], // A5E.SPELLCONSUMERMODES
	}),
	charges: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
	points: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
	spellLevel: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
	type: new fields.StringField({ required: true, nullable: false, blank: false, initial: 'spell' }),
	...baseSchema(),
});

// ======================================================
//                      NameSpaces
// ======================================================
declare namespace ActionUsesConsumerData {
	type Schema = DataSchema & ReturnType<typeof usesSchema>;
}

declare namespace AmmunitionConsumerData {
	type Schema = DataSchema & ReturnType<typeof quantitySchema>;
}

declare namespace HitDiceConsumerData {
	type Schema = DataSchema & ReturnType<typeof hitDiceSchema>;
}

declare namespace ItemUsesConsumerData {
	type Schema = DataSchema & ReturnType<typeof usesSchema>;
}

declare namespace QuantityConsumerData {
	type Schema = DataSchema & ReturnType<typeof quantitySchema>;
}

declare namespace ResourceConsumerData {
	type Schema = DataSchema & ReturnType<typeof resourceSchema>;
}

declare namespace SpellConsumerData {
	type Schema = DataSchema & ReturnType<typeof spellSchema>;
}

// ======================================================
//                       Classes
// ======================================================
class ActionUsesConsumerData extends DataModel<ActionUsesConsumerData.Schema> {
	static type = 'actionUses';

	static override defineSchema(): ActionUsesConsumerData.Schema {
		return {
			...usesSchema(),
		};
	}

	getActivationData(actor: Actor.OfType<'base'>, item: ItemA5e) {
		// @ts-expect-error
		const actionUses = this.parent?.uses ?? {};

		return {
			actionUses,
			baseUses: this.quantity ?? 1,
			maxUses: getDeterministicBonus(actionUses.max, actor.getRollData(item)),
			quantity: this.quantity ?? 1,
		};
	}
}

class AmmunitionConsumerData extends DataModel<AmmunitionConsumerData.Schema> {
	static type = 'ammunition';

	static override defineSchema(): AmmunitionConsumerData.Schema {
		return {
			...quantitySchema(),
		};
	}
}

class HitDiceConsumerData extends DataModel<HitDiceConsumerData.Schema> {
	static type = 'hitDice';

	static override defineSchema(): HitDiceConsumerData.Schema {
		return {
			...hitDiceSchema(),
		};
	}

	getActivationData(actor: Actor.OfType<'base'>, item: ItemA5e) {
		const availableHitDice = actor.HitDiceManager.availableList;

		const hitDiceData = {
			selected: Object.fromEntries(availableHitDice.map((hd, idx) => [hd, idx === 0 ? 1 : 0])),
			quantity: this.quantity ?? 1,
		};

		return {
			...hitDiceData,
		};
	}
}

class ItemUsesConsumerData extends DataModel<ItemUsesConsumerData.Schema> {
	static type = 'itemUses';

	static override defineSchema(): ItemUsesConsumerData.Schema {
		return {
			...usesSchema(),
		};
	}

	getActivationData(actor: Actor.OfType<'base'>, item: ItemA5e) {
		const itemUses = item.system.uses;

		return {
			baseUses: this.quantity ?? 1,
			maxUses: getDeterministicBonus(itemUses.max, actor.getRollData(item)),
			itemUses,
			quantity: this.quantity ?? 1,
		};
	}
}

class QuantityConsumerData extends DataModel<QuantityConsumerData.Schema> {
	static type = 'quantity';

	static override defineSchema(): QuantityConsumerData.Schema {
		return {
			...quantitySchema(),
		};
	}
}

class ResourceConsumerData extends DataModel<ResourceConsumerData.Schema> {
	static type = 'resource';

	static override defineSchema(): ResourceConsumerData.Schema {
		return {
			...resourceSchema(),
		};
	}
}

class SpellConsumerData extends DataModel<SpellConsumerData.Schema> {
	static type = 'spell';

	static override defineSchema(): SpellConsumerData.Schema {
		return {
			...spellSchema(),
		};
	}
}

const ACTION_CONSUMER_DATA_TYPES = {
	actionUses: ActionUsesConsumerData,
	ammunition: AmmunitionConsumerData,
	hitDice: HitDiceConsumerData,
	itemUses: ItemUsesConsumerData,
	quantity: QuantityConsumerData,
	resource: ResourceConsumerData,
	spell: SpellConsumerData,
} as const;

export {
	ACTION_CONSUMER_DATA_TYPES,
	ActionUsesConsumerData,
	AmmunitionConsumerData,
	HitDiceConsumerData,
	ItemUsesConsumerData,
	QuantityConsumerData,
	ResourceConsumerData,
	SpellConsumerData,
};
