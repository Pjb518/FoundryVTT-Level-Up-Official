/* eslint-disable max-classes-per-file */
import { RecordField } from '../../fields/RecordField';
import {
  ActionAreaField, ActionConsumerField, ActionPromptField, ActionRollField
} from './ActionFields';

const { fields } = foundry.data;

const actionSchema = () => ({
  name: new fields.StringField({ required: true, nullable: false, initial: 'New Action' }),
  // default: new fields.BooleanField({ required: false, nullable: false }),
  description: new fields.StringField({ required: true, nullable: false, initial: '' }),
  descriptionOutputs: new fields.ArrayField(
    new fields.StringField({ required: true, nullable: false, choices: ['action', 'item'] }),
    { required: true, initial: ['item', 'action'] }
  ),
  img: new fields.StringField({ required: true, initial: '' }),
  activation: new fields.SchemaField({
    cost: new fields.StringField({ required: true, nullable: false, initial: '' }),
    type: new fields.StringField({ required: true, nullable: true, initial: '' }),
    reactionTrigger: new fields.StringField({ required: true, nullable: false, initial: '' })
  }),

  // TODO: - Remove this
  area: new fields.ObjectField({ required: false, nullable: true, initial: () => undefined }),
  areas: new RecordField(
    new fields.DocumentIdField({
      required: true, nullable: false, initial: () => foundry.utils.randomID()
    }),
    new ActionAreaField({ required: true, nullable: false })
  ),

  duration: new fields.SchemaField({
    unit: new fields.StringField({ required: true, nullable: false, initial: '' }),
    value: new fields.NumberField({ required: true, nullable: true })
  }),

  consumers: new RecordField(
    new fields.DocumentIdField({
      required: true, nullable: false, initial: () => foundry.utils.randomID()
    }),
    new ActionConsumerField({ required: true, nullable: false })
  ),

  prompts: new RecordField(
    new fields.DocumentIdField({
      required: true, nullable: false, initial: () => foundry.utils.randomID()
    }),
    new ActionPromptField({ required: true, nullable: false })
  ),

  ranges: new fields.ObjectField({ required: true, nullable: false }),

  rolls: new RecordField(
    new fields.DocumentIdField({
      required: true, nullable: false, initial: () => foundry.utils.randomID()
    }),
    new ActionRollField({ required: true, nullable: false })
  ),

  target: new fields.SchemaField({
    quantity: new fields.NumberField({ required: true, nullable: true }),
    scaling: new fields.ObjectField({ required: true, nullable: false }),
    type: new fields.StringField({ required: true, nullable: false, initial: '' })
  }),

  uses: new fields.SchemaField({
    value: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
    max: new fields.StringField({ required: true, nullable: false, initial: '' }),
    per: new fields.StringField({ required: true, nullable: false, initial: '' }),
    recharge: new fields.SchemaField({
      formula: new fields.StringField({ required: true, nullable: false }),
      threshold: new fields.NumberField({ required: true, nullable: false, initial: 0 })
    })
  })
});

// ======================================================
//                   Action Data Model
// ======================================================
declare namespace A5EActionData {
  type Schema = DataSchema & ReturnType<typeof actionSchema>;
}

class A5EActionData extends foundry.abstract.DataModel<
  A5EActionData.Schema, Item.ConfiguredInstance
> {
  static override defineSchema(): A5EActionData.Schema {
    return {
      ...actionSchema()
    };
  }
}

// ======================================================
//                   Action Field
// ======================================================
class ActionField<
  const Options extends DataFieldOptions<object> = foundry.data.fields.ObjectField.DefaultOptions,
  const AssignmentType = typeof A5EActionData,
  const InitializedType = A5EActionData,
  const PersistedType extends object | null | undefined = A5EActionData

> extends foundry.data.fields.ObjectField<Options, AssignmentType, InitializedType, PersistedType> {
  override _cleanType(
    value: InitializedType,
    options?: foundry.data.fields.DataField.CleanOptions
  ): InitializedType {
    // @ts-expect-error
    if (!(typeof value === 'object')) value = {} as InitializedType;

    // @ts-expect-error
    return A5EActionData.cleanData(value, options);
  }

  override initialize(
    value: PersistedType,
    model: foundry.abstract.DataModel<DataSchema, any>,
    options = {}
  ): InitializedType {
    // @ts-expect-error
    return new A5EActionData(value, { parent: model, ...options });
  }
}

export { A5EActionData, ActionField };
