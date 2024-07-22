/* eslint-disable max-classes-per-file */
const { fields } = foundry.data;

// ======================================================
//                        Schemas
// ======================================================
const baseSchema = {
  default: new fields.BooleanField({ required: true, nullable: false, initial: true }),
  label: new fields.StringField({ required: true, nullable: false, initial: '' }),
  type: new fields.StringField({ required: true, nullable: false, initial: '' })
};

const abilityCheckSchema = () => ({
  ability: new fields.StringField({ required: true, nullable: false, initial: '' }), // TODO: Action - Set to proper
  ...baseSchema
});

const attackRollSchema = () => ({
  ability: new fields.StringField({ required: true, nullable: false, initial: '' }), // TODO: Action - Set to proper
  attackType: new fields.StringField({ required: true, nullable: false, initial: '' }),
  proficient: new fields.BooleanField({ required: true, nullable: false, initial: true }),
  ...baseSchema
});

const damageRollSchema = () => ({
  canCrit: new fields.BooleanField({ required: true, nullable: false, initial: true }),
  critBonus: new fields.StringField({ required: true, nullable: false, initial: '' }),
  damageType: new fields.StringField({ required: true, nullable: false, initial: '' }),
  formula: new fields.StringField({ required: true, nullable: false, initial: '' }),
  scaling: new fields.ObjectField({ required: true, nullable: false }), // TODO: Make this proper
  ...baseSchema
});

const genericRollSchema = () => ({
  formula: new fields.StringField({ required: true, nullable: false, initial: '' }),
  ...baseSchema
});

const healingRollSchema = () => ({
  formula: new fields.StringField({ required: true, nullable: false, initial: '' }),
  healingType: new fields.StringField({ required: true, nullable: false, initial: '' }),
  scaling: new fields.ObjectField({ required: true, nullable: false }), // TODO: Make this proper
  ...baseSchema
});

const savingThrowSchema = () => ({
  ability: new fields.StringField({ required: true, nullable: false, initial: '' }), // TODO: Action - Set to proper
  ...baseSchema
});

const skillCheckRollSchema = () => ({
  ability: new fields.StringField({ required: true, nullable: false, initial: '' }),
  skill: new fields.StringField({ required: true, nullable: false, initial: '' }),
  ...baseSchema
});

const toolCheckRollSchema = () => ({
  ability: new fields.StringField({ required: true, nullable: false, initial: '' }),
  tool: new fields.StringField({ required: true, nullable: false, initial: '' }),
  ...baseSchema
});

// ======================================================
//                      NameSpaces
// ======================================================
declare namespace AbilityCheckRollData {
  type Schema = DataSchema & ReturnType<typeof abilityCheckSchema>;
  interface BaseData { }
  interface DerivedData { }
}

declare namespace AttackRollData {
  type Schema = DataSchema & ReturnType<typeof attackRollSchema>;
  interface BaseData { }
  interface DerivedData { }
}

declare namespace DamageRollData {
  type Schema = DataSchema & ReturnType<typeof damageRollSchema>;
  interface BaseData { }
  interface DerivedData { }
}

declare namespace GenericRollData {
  type Schema = DataSchema & ReturnType<typeof genericRollSchema>;
  interface BaseData { }
  interface DerivedData { }
}

declare namespace HealingRollData {
  type Schema = DataSchema & ReturnType<typeof healingRollSchema>;
  interface BaseData { }
  interface DerivedData { }
}

declare namespace SavingThrowRollData {
  type Schema = DataSchema & ReturnType<typeof savingThrowSchema>;
  interface BaseData { }
  interface DerivedData { }
}

declare namespace SkillCheckRollData {
  type Schema = DataSchema & ReturnType<typeof skillCheckRollSchema>;
  interface BaseData { }
  interface DerivedData { }
}

declare namespace ToolCheckRollData {
  type Schema = DataSchema & ReturnType<typeof toolCheckRollSchema>;
  interface BaseData { }
  interface DerivedData { }
}

// ======================================================
//                       Classes
// ======================================================
class AbilityCheckRollData extends foundry.abstract.TypeDataModel<
  AbilityCheckRollData.Schema,
  foundry.abstract.Document<DataSchema, any, any>,
  AbilityCheckRollData.BaseData,
  AbilityCheckRollData.DerivedData
> {
  static override defineSchema(): AbilityCheckRollData.Schema {
    return {
      ...abilityCheckSchema()
    };
  }
}

class AttackRollData extends foundry.abstract.TypeDataModel<
  AttackRollData.Schema,
  foundry.abstract.Document<DataSchema, any, any>,
  AttackRollData.BaseData,
  AttackRollData.DerivedData
> {
  static override defineSchema(): AttackRollData.Schema {
    return {
      ...attackRollSchema()
    };
  }
}

class DamageRollData extends foundry.abstract.TypeDataModel<
  DamageRollData.Schema,
  foundry.abstract.Document<DataSchema, any, any>,
  DamageRollData.BaseData,
  DamageRollData.DerivedData
> {
  static override defineSchema(): DamageRollData.Schema {
    return {
      ...damageRollSchema()
    };
  }
}

class GenericRollData extends foundry.abstract.TypeDataModel<
  GenericRollData.Schema,
  foundry.abstract.Document<DataSchema, any, any>,
  GenericRollData.BaseData,
  GenericRollData.DerivedData
> {
  static override defineSchema(): GenericRollData.Schema {
    return {
      ...genericRollSchema()
    };
  }
}

class HealingRollData extends foundry.abstract.TypeDataModel<
  HealingRollData.Schema,
  foundry.abstract.Document<DataSchema, any, any>,
  HealingRollData.BaseData,
  HealingRollData.DerivedData
> {
  static override defineSchema(): HealingRollData.Schema {
    return {
      ...healingRollSchema()
    };
  }
}

class SavingThrowRollData extends foundry.abstract.TypeDataModel<
  SavingThrowRollData.Schema,
  foundry.abstract.Document<DataSchema, any, any>,
  SavingThrowRollData.BaseData,
  SavingThrowRollData.DerivedData
> {
  static override defineSchema(): SavingThrowRollData.Schema {
    return {
      ...savingThrowSchema()
    };
  }
}

class SkillCheckRollData extends foundry.abstract.TypeDataModel<
  SkillCheckRollData.Schema,
  foundry.abstract.Document<DataSchema, any, any>,
  SkillCheckRollData.BaseData,
  SkillCheckRollData.DerivedData
> {
  static override defineSchema(): SkillCheckRollData.Schema {
    return {
      ...skillCheckRollSchema()
    };
  }
}

class ToolCheckRollData extends foundry.abstract.TypeDataModel<
  ToolCheckRollData.Schema,
  foundry.abstract.Document<DataSchema, any, any>,
  ToolCheckRollData.BaseData,
  ToolCheckRollData.DerivedData
> {
  static override defineSchema(): ToolCheckRollData.Schema {
    return {
      ...toolCheckRollSchema()
    };
  }
}

export {
  AbilityCheckRollData,
  AttackRollData,
  DamageRollData,
  GenericRollData,
  HealingRollData,
  SavingThrowRollData,
  SkillCheckRollData,
  ToolCheckRollData
};
