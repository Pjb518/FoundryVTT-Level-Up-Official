import BaseActorData from './BaseActorData';

export default class NPCData extends BaseActorData {
  static defineSchema() {
    const { fields } = foundry.data;

    return foundry.utils.mergeObject(super.defineSchema(), {
      attributes: new fields.SchemaField({
        casterLevel: new fields.NumberField({ required: true, initial: 0, integer: true })
      })
    });
  }
}
