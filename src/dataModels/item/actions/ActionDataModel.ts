/* eslint-disable max-classes-per-file */
import type { A5EObjectData } from '../ObjectDataModel';
import {
  ActionAreaField, ActionConsumerField, ActionPromptField, ActionRollField
} from './ActionFields';
import { RecordField } from '../../fields/RecordField';

const { fields } = foundry.data;

const actionSchema = () => ({
  id: new fields.StringField({ required: true, nullable: false, initial: '' }),
  name: new fields.StringField({ required: true, nullable: false, initial: 'New Action' }),
  default: new fields.BooleanField({ required: true, nullable: false, initial: false }),
  description: new fields.StringField({ required: true, nullable: false, initial: '' }),
  descriptionOutputs: new fields.ArrayField(
    new fields.StringField({ required: true, nullable: false, choices: ['action', 'item'] }),
    { required: true, nullable: false, initial: ['item', 'action'] }
  ),
  img: new fields.StringField({ required: true, initial: '' }),
  activation: new fields.SchemaField({
    cost: new fields.NumberField({ required: true, nullable: false, initial: 1 }),
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
    value: new fields.NumberField({ required: true, nullable: false, initial: 0 })
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
    quantity: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
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
  A5EActionData.Schema, A5EObjectData
> {
  static override defineSchema(): A5EActionData.Schema {
    return {
      ...actionSchema()
    };
  }

  protected override _initialize(options?: any): void {
    super._initialize(options);

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

  prepareDerivedData() { }
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
    // eslint-disable-next-line no-param-reassign
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
