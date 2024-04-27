import ActorBaseGrant from './ActorBaseGrant';

export default class ActorProficiencyGrant extends ActorBaseGrant {
  // Declare Schema Variables
  declare proficiencyData: {
    keys: string[];
    total: number;
    proficiencyType: 'armor' | 'savingThrow' | 'skill' | 'tradition' | 'tool' | 'weapon';
  };

  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({ required: true, initial: 'proficiency' }),
      proficiencyData: new fields.SchemaField({
        keys: new fields.ArrayField(
          new fields.StringField({ required: true, initial: '' }),
          { required: true, initial: [] }
        ),
        total: new fields.NumberField({ nullable: false, initial: 0, integer: true }),
        proficiencyType: new fields.StringField({ required: true, initial: '' })
      })
    });
  }
}
