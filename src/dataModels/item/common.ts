// import { RecordField } from '../fields/RecordFieldN';
import RecordField from '../fields/RecordField';
import {
  ActionAreaField, ActionConsumerField, ActionPromptField, ActionRollField
} from './actions/ActionFields';

const { fields } = foundry.data;

// -----------------------------------------
// Actions
// -----------------------------------------
export const actions = () => ({
  // actions: new fields.ObjectField({ required: true, initial: {} })
  actions: new RecordField(
    new fields.DocumentIdField({ required: true, initial: () => foundry.utils.randomID() }),
    new fields.SchemaField({
      name: new fields.StringField({ required: true, nullable: false, initial: 'New Action' }),
      default: new fields.BooleanField({ required: false, nullable: false }),
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
    })
  )
});

export type ActionsData = ReturnType<typeof actions>;

// -----------------------------------------
// Armor
// -----------------------------------------
export const armor = () => ({
  ac: new fields.SchemaField({
    baseFormula: new fields.StringField({ required: true, initial: '' }),
    formula: new fields.StringField({ required: true, initial: '' }),
    grantsDisadvantage: new fields.BooleanField({ required: true, initial: false }),
    maxDex: new fields.NumberField({ required: true, initial: 0, min: 0 }),
    minStr: new fields.NumberField({ required: true, initial: 0, min: 0 }),
    mode: new fields.NumberField({ required: true, initial: 2 }),
    requiresNoShield: new fields.BooleanField({ required: true, initial: false }),
    requiresUnarmored: new fields.BooleanField({ required: true, initial: false })
  })
});

export type ArmorData = ReturnType<typeof armor>;

// -----------------------------------------
// Description
// -----------------------------------------
export const description = () => ({
  description: new fields.HTMLField({ required: true, initial: '' })
});

export const secretDescription = () => ({
  secretDescription: new fields.HTMLField({ required: true, initial: '' })
});

export type DescriptionData = ReturnType<typeof description>;
export type SecretDescriptionData = ReturnType<typeof secretDescription>;

// -----------------------------------------
// Favorite
// -----------------------------------------
export const favorite = () => ({
  favorite: new fields.BooleanField({ required: true, initial: false })
});

export type FavoriteData = ReturnType<typeof favorite>;

// -----------------------------------------
// Source
// -----------------------------------------
export const source = () => ({
  source: new fields.StringField({ required: true, initial: '' })
});

export type SourceData = ReturnType<typeof source>;

// -----------------------------------------
// Uses
// -----------------------------------------
export const uses = () => ({
  uses: new fields.SchemaField({
    value: new fields.NumberField({
      required: true, initial: 0, min: 0, integer: true, nullable: false
    }),
    max: new fields.StringField({ required: true, initial: '', nullable: false }),
    per: new fields.StringField({ required: true, initial: '' }),
    recharge: new fields.SchemaField({
      formula: new fields.StringField({ required: true, initial: '' }),
      threshold: new fields.NumberField({ required: true, initial: 0, integer: true })
    })
  })
});

export type UsesData = ReturnType<typeof uses>;
