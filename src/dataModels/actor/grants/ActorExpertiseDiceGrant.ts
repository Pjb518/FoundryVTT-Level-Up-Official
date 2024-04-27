import ActorBaseGrant from './ActorBaseGrant';

export default class ActorExpertiseDiceGrant extends ActorBaseGrant {
  // Declare Schema Variables
  declare expertiseDiceData: {
    keys: string[];
    total: number;
    expertiseCount: number;
    expertiseType: 'abilityCheck' | 'abilitySave' | 'attack' | 'initiative' | 'skill';
  };

  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({ required: true, initial: 'expertiseDice' }),
      expertiseDiceData: new fields.SchemaField({
        keys: new fields.ArrayField(
          new fields.StringField({ required: true, initial: '' }),
          { required: true, initial: [] }
        ),
        total: new fields.NumberField({ nullable: false, initial: 0, integer: true }),
        expertiseCount: new fields.NumberField({ nullable: false, initial: 1, integer: true }),
        expertiseType: new fields.StringField({ required: true, initial: '' })
      })
    });
  }
}
