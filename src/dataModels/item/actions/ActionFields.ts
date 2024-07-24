/* eslint-disable max-classes-per-file */
/* eslint-disable no-param-reassign */
import * as AreaData from './ActionAreaDataModels';
import * as ConsumerData from './ActionConsumersDataModel';
import * as PromptData from './ActionPromptsDataModel';
import * as RollData from './ActionRollsDataModel';

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

// ======================================================
//                       Areas
// ======================================================
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
    return foundry.utils.deepClone(value);
  }
}

// ======================================================
//                      Consumers
// ======================================================
declare namespace ActionConsumerField {
  type ConsumerTypes = 'actionUses' | 'ammunition' | 'hitDice' | 'itemUses' | 'quantity' | 'resource' | 'spell';
}

class ActionConsumerField<
  const Options extends DataFieldOptions<object> = foundry.data.fields.ObjectField.DefaultOptions,
  const AssignmentType = foundry.data.fields.ObjectField.AssignmentType<Options>,
  const InitializedType = foundry.data.fields.ObjectField.InitializedType<Options>,
  const PersistedType extends object | null | undefined = foundry.data.fields
  .ObjectField.InitializedType<Options>

> extends foundry.data.fields.ObjectField<Options, AssignmentType, InitializedType, PersistedType> {
  getModelForType(type: ActionConsumerField.ConsumerTypes) {
    if (type === 'actionUses') return ConsumerData.ActionUsesConsumerData;
    if (type === 'ammunition') return ConsumerData.AmmunitionConsumerData;
    if (type === 'hitDice') return ConsumerData.HitDiceConsumerData;
    if (type === 'itemUses') return ConsumerData.ItemUsesConsumerData;
    if (type === 'quantity') return ConsumerData.QuantityConsumerData;
    if (type === 'resource') return ConsumerData.ResourceConsumerData;
    if (type === 'spell') return ConsumerData.SpellConsumerData;

    return null;
  }

  // @ts-expect-error
  override _cleanType(
    value: InitializedType,
    options?: foundry.data.fields.DataField.CleanOptions
  ) {
    if (!(typeof value === 'object')) value = {} as InitializedType;

    // @ts-expect-error
    const Cls = this.getModelForType(value?.type);
    // @ts-expect-error
    if (Cls) return Cls.cleanData(value, options);
    return value;
  }

  // @ts-expect-error
  override initialize(
    value: PersistedType,
    model: foundry.abstract.DataModel<DataSchema, any>,
    options = {}
  ) {
    // @ts-expect-error
    const Cls = this.getModelForType(value?.type);
    // @ts-expect-error
    if (Cls) return new Cls(value, { parent: model, ...options });
    return foundry.utils.deepClone(value);
  }
}

// ======================================================
//                      Prompts
// ======================================================
declare namespace ActionPromptField {
  type PromptTypes = 'abilityCheck' | 'generic' | 'savingThrow' | 'skillCheck';
}

class ActionPromptField<
  const Options extends DataFieldOptions<object> = foundry.data.fields.ObjectField.DefaultOptions,
  const AssignmentType = foundry.data.fields.ObjectField.AssignmentType<Options>,
  const InitializedType = foundry.data.fields.ObjectField.InitializedType<Options>,
  const PersistedType extends object | null | undefined = foundry.data.fields
  .ObjectField.InitializedType<Options>

> extends foundry.data.fields.ObjectField<Options, AssignmentType, InitializedType, PersistedType> {
  getModelForType(type: ActionPromptField.PromptTypes) {
    if (type === 'abilityCheck') return PromptData.AbilityCheckPromptData;
    if (type === 'generic') return PromptData.GenericPromptData;
    if (type === 'savingThrow') return PromptData.SavingThrowPromptData;
    if (type === 'skillCheck') return PromptData.SkillCheckPromptData;

    return null;
  }

  // @ts-expect-error
  override _cleanType(
    value: InitializedType,
    options?: foundry.data.fields.DataField.CleanOptions
  ) {
    if (!(typeof value === 'object')) value = {} as InitializedType;

    // @ts-expect-error
    const Cls = this.getModelForType(value?.type);
    // @ts-expect-error
    if (Cls) return Cls.cleanData(value, options);
    return value;
  }

  // @ts-expect-error
  override initialize(
    value: PersistedType,
    model: foundry.abstract.DataModel<DataSchema, any>,
    options = {}
  ) {
    // @ts-expect-error
    const Cls = this.getModelForType(value?.type);
    // @ts-expect-error
    if (Cls) return new Cls(value, { parent: model, ...options });
    return foundry.utils.deepClone(value);
  }
}

// ======================================================
//                       Rolls
// ======================================================
declare namespace ActionRollField {
  type RollTypes = 'abilityCheck' | 'attack' | 'damage' | 'generic' | 'healing' | 'savingThrow' | 'skillCheck' | 'toolCheck';
}

class ActionRollField<
  const Options extends DataFieldOptions<object> = foundry.data.fields.ObjectField.DefaultOptions,
  const AssignmentType = foundry.data.fields.ObjectField.AssignmentType<Options>,
  const InitializedType = foundry.data.fields.ObjectField.InitializedType<Options>,
  const PersistedType extends object | null | undefined = foundry.data.fields
  .ObjectField.InitializedType<Options>

> extends foundry.data.fields.ObjectField<Options, AssignmentType, InitializedType, PersistedType> {
  getModelForType(type: ActionRollField.RollTypes) {
    if (type === 'abilityCheck') return RollData.AbilityCheckRollData;
    if (type === 'attack') return RollData.AttackRollData;
    if (type === 'damage') return RollData.DamageRollData;
    if (type === 'generic') return RollData.GenericRollData;
    if (type === 'healing') return RollData.HealingRollData;
    if (type === 'savingThrow') return RollData.SavingThrowRollData;
    if (type === 'skillCheck') return RollData.SkillCheckRollData;
    if (type === 'toolCheck') return RollData.ToolCheckRollData;

    return null;
  }

  // @ts-expect-error
  override _cleanType(
    value: InitializedType,
    options?: foundry.data.fields.DataField.CleanOptions
  ) {
    if (!(typeof value === 'object')) value = {} as InitializedType;

    // @ts-expect-error
    const Cls = this.getModelForType(value?.type);
    // @ts-expect-error
    if (Cls) return Cls.cleanData(value, options);
    return value;
  }

  // @ts-expect-error
  override initialize(
    value: PersistedType,
    model: foundry.abstract.DataModel<DataSchema, any>,
    options = {}
  ) {
    // @ts-expect-error
    const Cls = this.getModelForType(value?.type);
    // @ts-expect-error
    if (Cls) return new Cls(value, { parent: model, ...options });
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
