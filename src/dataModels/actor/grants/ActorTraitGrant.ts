import ActorBaseGrant from './ActorBaseGrant';

export default class ActorTraitGrant extends ActorBaseGrant {
  // Declare Schema Variables
  declare traitData: {
    traits: string[];
    total: number;
    // TODO: Add specific types
    traitType: string;
  };

  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({ required: true, initial: 'trait' }),
      traitData: new fields.SchemaField({
        traits: new fields.ArrayField(
          new fields.StringField({ required: true, initial: '' }),
          { required: true, initial: [] }
        ),
        total: new fields.NumberField({ nullable: false, initial: 0, integer: true }),
        traitType: new fields.StringField({ required: true, initial: '' })
      })
    });
  }
}
