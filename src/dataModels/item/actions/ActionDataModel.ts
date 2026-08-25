import { RecordField } from '../../fields/RecordField.ts';
import type { A5EObjectData } from '../ObjectDataModel.ts';
import { ActionConsumerField, ActionPromptField } from './ActionFields.ts';

import fields = foundry.data.fields;

import type { AnyObject } from 'fvtt-types/utils';
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

	consumers: new RecordField(
		new fields.DocumentIdField({
			required: true,
			nullable: false,
			initial: () => foundry.utils.randomID(),
		}),
		new ActionConsumerField({ required: true, nullable: false }),
	),

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
		this.prepareDerivedData();
	}

	/** -------------Helpers---------------- */
	rollsByType(type: ActionRollField.RollTypes) {
		const rolls = Object.entries(this.rolls ?? {});
		return rolls.filter(([, roll]) => roll.type === type);
	}

	prepareBaseData() {
		this.img ||= this.parent.parent.img || '';
	}

	prepareDerivedData() {}
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
