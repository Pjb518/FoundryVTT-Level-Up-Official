/* eslint-disable max-len */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-param-reassign */
import * as AreaData from './ActionAreaDataModels';
import * as ConsumerData from './ActionConsumersDataModel';
import * as PromptData from './ActionPromptsDataModel';
import * as RollData from './ActionRollsDataModel';

// ======================================================
//                       Areas
// ======================================================
const areaShapesMap = {
  circle: AreaData.CircleAreaData,
  cone: AreaData.ConeAreaData,
  cube: AreaData.CubeAreaData,
  cylinder: AreaData.CylinderAreaData,
  emanation: AreaData.EmanationAreaData,
  line: AreaData.LineAreaData,
  sphere: AreaData.SphereAreaData,
  square: AreaData.SquareAreaData,
  wall: AreaData.WallAreaData
} as const;

declare namespace ActionAreaField {
  export type AreaShapesMap = typeof areaShapesMap;

  export type AreaShapes = keyof AreaShapesMap;
}

class ActionAreaField<
  const Options extends DataFieldOptions<object> = foundry.data.fields.ObjectField.DefaultOptions,
  const AreaType extends ActionAreaField.AreaShapes = ActionAreaField.AreaShapes,
  const AssignmentType = { type: AreaType },
  const InitializedType = ActionAreaField.AreaShapesMap[AreaType],
  const PersistedType extends object | null | undefined = ActionAreaField.AreaShapesMap[AreaType]
> extends foundry.data.fields.ObjectField<Options, AssignmentType, InitializedType, PersistedType> {
  getModelForType(type: ActionAreaField.AreaShapes) {
    return areaShapesMap[type];
  }

  override _cleanType(
    value: InitializedType,
    options?: foundry.data.fields.DataField.CleanOptions
  ): InitializedType {
    if (!(typeof value === 'object')) value = {} as InitializedType;

    // @ts-expect-error
    const Cls = this.getModelForType(value?.type);
    // @ts-expect-error
    if (Cls) return Cls.cleanData(value, options);
    return value;
  }

  override initialize(
    value: PersistedType,
    model: foundry.abstract.DataModel<DataSchema, any>,
    options = {}
  ): InitializedType {
    // @ts-expect-error
    const Cls = this.getModelForType(value?.type);
    // @ts-expect-error
    if (Cls) return new Cls(value, { parent: model, ...options });
    // @ts-expect-error
    return foundry.utils.deepClone(value);
  }
}

// ======================================================
//                      Consumers
// ======================================================
const consumerShapesMap = {
  actionUses: ConsumerData.ActionUsesConsumerData,
  ammunition: ConsumerData.AmmunitionConsumerData,
  hitDice: ConsumerData.HitDiceConsumerData,
  itemUses: ConsumerData.ItemUsesConsumerData,
  quantity: ConsumerData.QuantityConsumerData,
  resource: ConsumerData.ResourceConsumerData,
  spell: ConsumerData.SpellConsumerData
} as const;

declare namespace ActionConsumerField {
  export type ConsumerShapesMap = typeof consumerShapesMap;

  export type ConsumerTypes = keyof ConsumerShapesMap;
}

class ActionConsumerField<
  const Options extends DataFieldOptions<object> = foundry.data.fields.ObjectField.DefaultOptions,
  const ConsumerType extends ActionConsumerField.ConsumerTypes = ActionConsumerField.ConsumerTypes,
  const AssignmentType = { type: ConsumerType },
  const InitializedType = ActionConsumerField.ConsumerShapesMap[ConsumerType],
  const PersistedType extends object | null | undefined = ActionConsumerField.ConsumerShapesMap[ConsumerType]

> extends foundry.data.fields.ObjectField<Options, AssignmentType, InitializedType, PersistedType> {
  getModelForType(type: ActionConsumerField.ConsumerTypes) {
    return consumerShapesMap[type];
  }

  override _cleanType(
    value: InitializedType,
    options?: foundry.data.fields.DataField.CleanOptions
  ): InitializedType {
    if (!(typeof value === 'object')) value = {} as InitializedType;

    // @ts-expect-error
    const Cls = this.getModelForType(value?.type);
    // @ts-expect-error
    if (Cls) return Cls.cleanData(value, options);
    return value;
  }

  override initialize(
    value: PersistedType,
    model: foundry.abstract.DataModel<DataSchema, any>,
    options = {}
  ): InitializedType {
    // @ts-expect-error
    const Cls = this.getModelForType(value?.type);
    // @ts-expect-error
    if (Cls) return new Cls(value, { parent: model, ...options });
    // @ts-expect-error
    return foundry.utils.deepClone(value);
  }
}

// ======================================================
//                      Prompts
// ======================================================
const promptTypesMap = {
  abilityCheck: PromptData.AbilityCheckPromptData,
  generic: PromptData.GenericPromptData,
  savingThrow: PromptData.SavingThrowPromptData,
  skillCheck: PromptData.SkillCheckPromptData
} as const;

declare namespace ActionPromptField {
  export type PromptTypesMap = typeof promptTypesMap;

  export type PromptTypes = keyof PromptTypesMap;
}

class ActionPromptField<
  const Options extends DataFieldOptions<object> = foundry.data.fields.ObjectField.DefaultOptions,
  const PromptType extends ActionPromptField.PromptTypes = ActionPromptField.PromptTypes,
  const AssignmentType = { type: PromptType },
  const InitializedType = ActionPromptField.PromptTypesMap[PromptType],
  const PersistedType extends object | null | undefined = ActionPromptField.PromptTypesMap[PromptType]
> extends foundry.data.fields.ObjectField<Options, AssignmentType, InitializedType, PersistedType> {
  getModelForType(type: ActionPromptField.PromptTypes) {
    return promptTypesMap[type];
  }

  override _cleanType(
    value: InitializedType,
    options?: foundry.data.fields.DataField.CleanOptions
  ): InitializedType {
    if (!(typeof value === 'object')) value = {} as InitializedType;

    // @ts-expect-error
    const Cls = this.getModelForType(value?.type);
    // @ts-expect-error
    if (Cls) return Cls.cleanData(value, options);
    return value;
  }

  override initialize(
    value: PersistedType,
    model: foundry.abstract.DataModel<DataSchema, any>,
    options = {}
  ): InitializedType {
    // @ts-expect-error
    const Cls = this.getModelForType(value?.type);
    // @ts-expect-error
    if (Cls) return new Cls(value, { parent: model, ...options });
    // @ts-expect-error
    return foundry.utils.deepClone(value);
  }
}

// ======================================================
//                       Rolls
// ======================================================
const rollTypesMap = {
  abilityCheck: RollData.AbilityCheckRollData,
  attack: RollData.AttackRollData,
  damage: RollData.DamageRollData,
  generic: RollData.GenericRollData,
  healing: RollData.HealingRollData,
  savingThrow: RollData.SavingThrowRollData,
  skillCheck: RollData.SkillCheckRollData,
  toolCheck: RollData.ToolCheckRollData
} as const;

declare namespace ActionRollField {
  export type RollTypesMap = typeof rollTypesMap;

  export type RollTypes = keyof RollTypesMap;
}

class ActionRollField<
  const Options extends DataFieldOptions<object> = foundry.data.fields.ObjectField.DefaultOptions,
  const RollType extends ActionRollField.RollTypes = ActionRollField.RollTypes,
  const AssignmentType = { type: RollType },
  const InitializedType = ActionRollField.RollTypesMap[RollType],
  const PersistedType extends object | null | undefined = ActionRollField.RollTypesMap[RollType]
> extends foundry.data.fields.ObjectField<Options, AssignmentType, InitializedType, PersistedType> {
  getModelForType(type: ActionRollField.RollTypes) {
    return rollTypesMap[type];
  }

  override _cleanType(
    value: InitializedType,
    options?: foundry.data.fields.DataField.CleanOptions
  ): InitializedType {
    if (!(typeof value === 'object')) value = {} as InitializedType;

    // @ts-expect-error
    const Cls = this.getModelForType(value?.type);
    // @ts-expect-error
    if (Cls) return Cls.cleanData(value, options);
    return value;
  }

  override initialize(
    value: PersistedType,
    model: foundry.abstract.DataModel<DataSchema, any>,
    options = {}
  ): InitializedType {
    // @ts-expect-error
    const Cls = this.getModelForType(value?.type);
    // @ts-expect-error
    if (Cls) return new Cls(value, { parent: model, ...options });
    // @ts-expect-error
    return foundry.utils.deepClone(value);
  }
}

// ======================================================
//                      Exports
// ======================================================
export {
  ActionAreaField,
  ActionConsumerField,
  ActionPromptField,
  ActionRollField
};
