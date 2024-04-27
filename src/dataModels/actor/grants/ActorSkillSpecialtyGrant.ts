import ActorBaseGrant from './ActorBaseGrant';

export default class ActorSkillSpecialtyGrant extends ActorBaseGrant {
  // Declare Schema Variables
  declare specialtyData: {
    specialties: string[];
    total: number;
    skill: string;
  };

  defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({ required: true, initial: 'skillSpecialty' }),
      specialtyData: new fields.SchemaField({
        specialties: new fields.ArrayField(
          new fields.StringField({ required: true, initial: '' }),
          { required: true, initial: [] }
        ),
        total: new fields.NumberField({ nullable: false, initial: 0, integer: true }),
        skill: new fields.StringField({ required: true, initial: '' })
      })
    });
  }
}
