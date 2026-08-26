import { A5E } from '../../../config.ts';

import fields = foundry.data.fields;
import DataModel = foundry.abstract.DataModel;

// ======================================================
//                        Schemas
// ======================================================
const baseSchema = () => ({
	default: new fields.BooleanField({ required: true, nullable: false, initial: true }),
	label: new fields.StringField({ required: true, nullable: false, initial: '' }),
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
}

class ItemUsesConsumerData extends DataModel<ItemUsesConsumerData.Schema> {
	static type = 'itemUses';

	static override defineSchema(): ItemUsesConsumerData.Schema {
		return {
			...usesSchema(),
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
