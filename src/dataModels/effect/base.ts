import { migrationData } from "../common.ts";

const { fields } = foundry.data;

const baseSchema = () => ({
  applyToSelf: new fields.BooleanField({
    required: true,
    nullable: false,
    initial: false,
  }),
  changes: new fields.ArrayField(
    new fields.SchemaField({
      key: new fields.StringField({ required: true }),
      // We can use this to get our custom types in
      type: new fields.StringField({
        required: true,
        blank: false,
        initial: "add",
      }),
      value: new fields.AnyField({
        required: true,
        nullable: true,
        serializable: true,
        initial: "",
      }),
      phase: new fields.StringField({
        required: true,
        blank: false,
        initial: "initial",
      }),
      priority: new fields.NumberField(),
    }),
  ),
  effectType: new fields.StringField({
    required: true,
    nullable: false,
    initial: "passive",
  }),
  default: new fields.BooleanField({
    required: true,
    nullable: false,
    initial: true,
  }),
});

declare namespace A5EBaseActiveEffectData {
  type Schema = DataSchema &
    ReturnType<typeof baseSchema> &
    ReturnType<typeof migrationData>;
  type BaseData = Record<string, unknown>;
  type DerivedData = Record<string, unknown>;
}

class A5EBaseActiveEffectData extends foundry.abstract.TypeDataModel<
  A5EBaseActiveEffectData.Schema,
  ActiveEffect.ConfiguredInstance,
  A5EBaseActiveEffectData.BaseData,
  A5EBaseActiveEffectData.DerivedData
> {
  static override defineSchema(): A5EBaseActiveEffectData.Schema {
    return {
      ...baseSchema(),
      ...migrationData(),
    };
  }
}

export { A5EBaseActiveEffectData };
