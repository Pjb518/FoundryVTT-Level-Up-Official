/* eslint-disable no-param-reassign */
import * as RollData from './ActionRollDataModel';

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

    const Cls = this.getModelForType(value?.type);
    if (Cls) return Cls.cleanData(value, options);
    return value;
  }

  override initialize(
    value: PersistedType,
    model: foundry.abstract.DataModel<DataSchema, any>,
    options = {}
  ) {
    const Cls = this.getModelForType(value?.type);
    if (Cls) return new Cls(value, { parent: model, ...options });
    return foundry.utils.deepClone(value);
  }
}

export { ActionRollField };
