import BaseActorData from './BaseActorData';

export default class CharacterData extends BaseActorData {
  static defineSchema() {
    const { fields } = foundry.data;

    return foundry.utils.mergeObject(super.defineSchema(), {
      supply: new fields.NumberField({ required: true, initial: 0, integer: true })
    });
  }
}
