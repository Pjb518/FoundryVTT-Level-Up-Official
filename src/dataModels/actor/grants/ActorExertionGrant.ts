import ActorBaseGrant from './ActorBaseGrant';

export default class ActorExertionGrant extends ActorBaseGrant {
  // Declare Schema Variables
  declare exertionData: {
    exertionType: 'bonus' | 'pool';
    bonusId?: string;
    poolType: 'none' | 'prof' | 'doubleProf';
  };

  declare type: string;

  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({ required: true, initial: 'exertion' }),
      exertionData: new fields.SchemaField({
        exertionType: new fields.StringField({ required: true, initial: '' }),
        bonusId: new fields.StringField({ required: false, initial: '' }),
        poolType: new fields.StringField({ required: true, initial: '' })
      }),
      type: new fields.StringField({ required: true, initial: '' })
    });
  }
}
