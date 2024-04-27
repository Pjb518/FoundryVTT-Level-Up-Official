import ActorBaseGrant from './ActorBaseGrant';

export default class ActorBonusGrant extends ActorBaseGrant {
  // Declare Schema Variables
  declare bonusId: string;

  declare type: string;

  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({ required: true, initial: 'bonus' }),
      bonusId: new fields.StringField({ required: true, initial: '' }),
      type: new fields.StringField({ required: true, initial: '' })
    });
  }
}
