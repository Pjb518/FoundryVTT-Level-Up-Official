import A5EDataModel from '../A5EDataModel';
import SchemaDataModel from '../template/SchemaDataModel';

export default class BaseActorData extends A5EDataModel.mixin(SchemaDataModel) {
  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      abilities: new fields.ObjectField(),
      attributes: new fields.ObjectField(),
      bonuses: new fields.ObjectField(),
      currency: new fields.ObjectField(),
      details: new fields.ObjectField(),
      proficiencies: new fields.ObjectField(),
      resources: new fields.ObjectField(),
      skills: new fields.ObjectField(),
      source: new fields.ObjectField(),
      traits: new fields.ObjectField(),
      spellResources: new fields.ObjectField()
    });
  }
}
