import type { A5EObjectData } from '../ObjectDataModel.ts';

import fields = foundry.data.fields;

import type { AnyObject } from 'fvtt-types/utils';
import { groupBy } from '#utils/groupBy.ts';
import { ACTION_CONSUMER_DATA_TYPES } from './ActionConsumersDataModel.ts';
import { ACTION_PROMPT_DATA_TYPES } from './ActionPromptsDataModel.ts';
import { ACTION_ROLL_DATA_TYPES } from './ActionRollsDataModel.ts';

const actionSchema = () => ({
	id: new fields.StringField({ required: true, nullable: false, initial: '' }),
	name: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'New Action',
	}),
	default: new fields.BooleanField({
		required: true,
		nullable: false,
		initial: false,
	}),
	description: new fields.StringField({
		required: true,
		nullable: false,
		initial: '',
	}),
	descriptionOutputs: new fields.ArrayField(
		new fields.StringField({
			required: true,
			nullable: false,
			choices: ['action', 'item'],
		}),
		{ required: true, nullable: false, initial: ['item', 'action'] },
	),
	img: new fields.StringField({ required: true, initial: '' }),
	activation: new fields.SchemaField({
		cost: new fields.NumberField({
			required: true,
			nullable: false,
			initial: 1,
		}),
		type: new fields.StringField({
			required: true,
			nullable: true,
			initial: '',
		}),
		reactionTrigger: new fields.StringField({
			required: true,
			nullable: false,
			initial: '',
		}),
	}),

	area: new fields.ObjectField({
		required: false,
		nullable: true,
		initial: () => undefined,
	}),

	duration: new fields.SchemaField({
		unit: new fields.StringField({
			required: true,
			nullable: false,
			initial: '',
		}),
		value: new fields.StringField({
			required: true,
			nullable: false,
			initial: '0',
		}),
		concentration: new fields.BooleanField({ required: true, nullable: false, initial: false }),
	}),

	effects: new fields.SetField(
		new fields.StringField({ required: true, nullable: false, initial: '' }),
		{ required: true, nullable: false },
	),

	macro: new fields.JavaScriptField({
		required: true,
		nullable: false,
		initial: '',
		async: true,
	}),

	// consumers: new RecordField(
	// 	new fields.DocumentIdField({
	// 		required: true,
	// 		nullable: false,
	// 		initial: () => foundry.utils.randomID(),
	// 	}),
	// 	new ActionConsumerField({ required: true, nullable: false }),
	// ),

	consumers: new fields.TypedObjectField(new fields.TypedSchemaField(ACTION_CONSUMER_DATA_TYPES)),
	prompts: new fields.TypedObjectField(new fields.TypedSchemaField(ACTION_PROMPT_DATA_TYPES)),
	ranges: new fields.ObjectField({ required: true, nullable: false }),
	rolls: new fields.TypedObjectField(new fields.TypedSchemaField(ACTION_ROLL_DATA_TYPES)),

	target: new fields.SchemaField({
		heard: new fields.BooleanField({
			required: true,
			nullable: false,
			initial: false,
		}),
		otherText: new fields.StringField({
			required: true,
			nullable: false,
			initial: '',
		}),
		quantity: new fields.NumberField({
			required: true,
			nullable: false,
			initial: 1,
		}),
		scaling: new fields.ObjectField({ required: true, nullable: false }),
		seen: new fields.BooleanField({
			required: true,
			nullable: false,
			initial: false,
		}),
		type: new fields.StringField({
			required: true,
			nullable: false,
			initial: '',
		}),
	}),

	uses: new fields.SchemaField({
		value: new fields.NumberField({
			required: true,
			nullable: false,
			initial: 0,
		}),
		max: new fields.StringField({
			required: true,
			nullable: false,
			initial: '',
		}),
		per: new fields.StringField({
			required: true,
			nullable: false,
			initial: '',
		}),
		recharge: new fields.SchemaField({
			formula: new fields.StringField({ required: true, nullable: false }),
			threshold: new fields.NumberField({
				required: true,
				nullable: false,
				initial: 0,
			}),
			type: new fields.StringField({
				required: true,
				initial: 'recoverAll',
				choices: ['formula', 'recoverAll', 'loseAll'],
			}),
		}),
	}),
});

// ======================================================
//                   Action Data Model
// ======================================================
declare namespace A5EActionData {
	type Schema = DataSchema & ReturnType<typeof actionSchema>;
}

class A5EActionData extends foundry.abstract.DataModel<A5EActionData.Schema, A5EObjectData> {
	static override defineSchema(): A5EActionData.Schema {
		return {
			...actionSchema(),
		};
	}

	protected init(options?: any): void {
		this.prepareBaseData();
	}

	/** ------------- Props ---------------- */
	_effects: Map<string, ActiveEffect> = new Map();

	/** ------------- Getters ---------------- */
	get item() {
		return this.parent.parent;
	}

	get invalidRolls() {
		return Object.values(this.rolls ?? {}).reduce((acc, roll) => {
			if (roll.formulaInvalid) acc.push(roll.id);
			return acc;
		}, [] as string[]);
	}

	get invalidPrompts() {
		return Object.values(this.prompts ?? {}).reduce((acc, prompt) => {
			if (prompt.formulaInvalid) acc.push(prompt.id);
			return acc;
		}, [] as string[]);
	}

	/** -------------Helpers---------------- */
	getDefaultIds(property: 'consumers' | 'prompts' | 'rolls'): string[] {
		const arr = Object.values(this[property] ?? {});
		if (!arr.length) return [] as string[];

		return arr.reduce((acc, prop) => {
			if (prop.default) {
				if (property === 'rolls' || property === 'prompts') {
					if (!prop.formulaInvalid) acc.push(prop.id);
				} else acc.push(prop.id);
			}
			return acc;
		}, [] as string[]);
	}

	getConsumersByType() {
		const consumersArr = Object.values(this.consumers ?? {});
		const grouped = groupBy(consumersArr, 'type');

		return {
			actionUses: grouped.actionUses?.at(0) || null,
			ammunition: grouped.ammunition?.at(0) || null,
			hitDice: grouped.hitDice?.at(0) || null,
			itemUses: grouped.itemUses?.at(0) || null,
			quantity: grouped.hitDice?.at(0) || null,
			resource: grouped.resource || null,
			spell: grouped.spell?.at(0) || null,
		};
	}

	getPromptsByType() {
		const promptsArr = Object.values(this.prompts ?? {});
		return groupBy(promptsArr, 'type');
	}

	getRollsByType() {
		const rollsArr = Object.values(this.rolls ?? {});
		return groupBy(rollsArr, 'type');
	}

	filterRollsByType(type: ActionRollField.RollTypes) {
		const rolls = Object.entries(this.rolls ?? {});
		return rolls.filter(([, roll]) => roll.type === type);
	}

	/** --------- Data Model Functions ---------------- */
	prepareBaseData() {
		this.img ||= this.parent.parent.img || '';

		// Set Data for consumers
		Object.entries(this.consumers ?? {}).forEach(([id, consumer]) => {
			consumer.id = id;
		});

		// Set Data for prompts
		Object.entries(this.prompts ?? {}).forEach(([id, prompt]) => {
			prompt.id = id;

			// Prepare Base Data
			prompt.prepareBaseData();
		});

		// Set Data for prompts
		Object.entries(this.rolls ?? {}).forEach(([id, roll]) => {
			roll.id = id;

			// Prepare Base Data
			roll.prepareBaseData();
		});
	}

	prepareDerivedData() {
		// Prepare effect Documents
		this.effects.forEach((e) => {
			const effect = this.item.effects.get(e);
			if (!effect) return;

			this._effects.set(e, effect);
		});
	}
}

// ======================================================
//                   Action Field
// ======================================================
const x = new fields.EmbeddedDataField(A5EActionData);

class ActionField<
	const Element extends fields.DataField.Any = typeof x,
	const Options extends
		fields.TypedObjectField.Options<AnyObject> = fields.TypedObjectField.DefaultOptions,
	const AssignmentType = fields.TypedObjectField.AssignmentType<Element, Options>,
	const InitializedType = fields.TypedObjectField.InitializedType<Element, Options>,
	const PersistedType extends
		| AnyObject
		| null
		| undefined = fields.TypedObjectField.InitializedType<Element, Options>,
> extends fields.TypedObjectField<Options, AssignmentType, InitializedType, PersistedType> {
	constructor(options = {} as Options, context = {} as fields.DataField.ConstructionContext) {
		const field = new fields.EmbeddedDataField(A5EActionData);
		options.validateKey ||= (key) => foundry.data.validators.isValidId(key);
		super(field, options, context);
	}

	override initialize(
		value: InitializedType,
		model: foundry.abstract.DataModel.Any,
		options?: fields.DataField.InitializeOptions,
	): InitializedType | (() => InitializedType | null) {
		const init = super.initialize(value, model, options);
		for (const [id, model] of Object.entries(init)) {
			model.init(options);
		}
		return init;
	}
}

export { A5EActionData, ActionField };
