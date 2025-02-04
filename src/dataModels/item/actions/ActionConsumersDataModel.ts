/* eslint-disable max-classes-per-file */
const { fields } = foundry.data;

// ======================================================
//                        Schemas
// ======================================================
const baseSchema = () => ({
	default: new fields.BooleanField({ required: true, nullable: false, initial: true }),
	label: new fields.StringField({ required: true, nullable: false, initial: '' }),
	type: new fields.StringField({ required: true, nullable: false, initial: '' }),
});

const usesSchema = () => ({
	quantity: new fields.NumberField({ required: true, nullable: false, initial: 1 }),
	...baseSchema(),
});

const quantitySchema = () => ({
	itemId: new fields.StringField({ required: true, nullable: false, initial: '' }),
	quantity: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
	deleteOnZero: new fields.BooleanField({ required: true, nullable: false, initial: false }),
	...baseSchema(),
});

const hitDiceSchema = () => ({
	quantity: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
	...baseSchema(),
});

const resourceSchema = () => ({
	classIdentifier: new fields.StringField({ required: true, nullable: false, initial: '' }),
	quantity: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
	resource: new fields.StringField({ required: true, nullable: false, initial: '' }),
	restore: new fields.BooleanField({ required: true, nullable: false, initial: false }),
	...baseSchema(),
});

const spellSchema = () => ({
	mode: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'variable',
		choices: [...CONFIG.A5E.SPELL_CONSUMER_MODES],
	}),
	charges: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
	points: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
	spellLevel: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
	...baseSchema(),
});

// ======================================================
//                      NameSpaces
// ======================================================
declare namespace ActionUsesConsumerData {
	type Schema = foundry.data.fields.DataSchema & ReturnType<typeof usesSchema>;
}

declare namespace AmmunitionConsumerData {
	type Schema = foundry.data.fields.DataSchema & ReturnType<typeof quantitySchema>;
}

declare namespace HitDiceConsumerData {
	type Schema = foundry.data.fields.DataSchema & ReturnType<typeof hitDiceSchema>;
}

declare namespace ItemUsesConsumerData {
	type Schema = foundry.data.fields.DataSchema & ReturnType<typeof usesSchema>;
}

declare namespace QuantityConsumerData {
	type Schema = foundry.data.fields.DataSchema & ReturnType<typeof quantitySchema>;
}

declare namespace ResourceConsumerData {
	type Schema = foundry.data.fields.DataSchema & ReturnType<typeof resourceSchema>;
}

declare namespace SpellConsumerData {
	type Schema = foundry.data.fields.DataSchema & ReturnType<typeof spellSchema>;
}

// ======================================================
//                       Classes
// ======================================================
class ActionUsesConsumerData extends foundry.abstract.DataModel<
	ActionUsesConsumerData.Schema,
	foundry.abstract.Document<'Item', any, any>
> {
	static override defineSchema(): ActionUsesConsumerData.Schema {
		return {
			...usesSchema(),
		};
	}
}

class AmmunitionConsumerData extends foundry.abstract.DataModel<
	AmmunitionConsumerData.Schema,
	foundry.abstract.Document<'Item', any, any>
> {
	static override defineSchema(): AmmunitionConsumerData.Schema {
		return {
			...quantitySchema(),
		};
	}
}

class HitDiceConsumerData extends foundry.abstract.DataModel<
	HitDiceConsumerData.Schema,
	foundry.abstract.Document<'Item', any, any>
> {
	static override defineSchema(): HitDiceConsumerData.Schema {
		return {
			...hitDiceSchema(),
		};
	}
}

class ItemUsesConsumerData extends foundry.abstract.DataModel<
	ItemUsesConsumerData.Schema,
	foundry.abstract.Document<'Item', any, any>
> {
	static override defineSchema(): ItemUsesConsumerData.Schema {
		return {
			...usesSchema(),
		};
	}
}

class QuantityConsumerData extends foundry.abstract.DataModel<
	QuantityConsumerData.Schema,
	foundry.abstract.Document<'Item', any, any>
> {
	static override defineSchema(): QuantityConsumerData.Schema {
		return {
			...quantitySchema(),
		};
	}
}

class ResourceConsumerData extends foundry.abstract.DataModel<
	ResourceConsumerData.Schema,
	foundry.abstract.Document<'Item', any, any>
> {
	static override defineSchema(): ResourceConsumerData.Schema {
		return {
			...resourceSchema(),
		};
	}
}

class SpellConsumerData extends foundry.abstract.DataModel<
	SpellConsumerData.Schema,
	foundry.abstract.Document<'Item', any, any>
> {
	static override defineSchema(): SpellConsumerData.Schema {
		return {
			...spellSchema(),
		};
	}
}

export {
	ActionUsesConsumerData,
	AmmunitionConsumerData,
	HitDiceConsumerData,
	ItemUsesConsumerData,
	QuantityConsumerData,
	ResourceConsumerData,
	SpellConsumerData,
};
