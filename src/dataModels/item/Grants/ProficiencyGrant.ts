import BaseGrant from './BaseGrant';

export default class ProficiencyGrant extends BaseGrant {
  #component = null;

  #configComponent = null;

  #type = 'proficiency';

  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({ required: true, initial: 'proficiency' }),
      choices: new fields.SchemaField({
        base: new fields.ArrayField(
          new fields.StringField({ nullable: false, initial: '' }),
          { required: true, initial: [] }
        ),
        options: new fields.ArrayField(
          new fields.StringField({ nullable: false, initial: '' }),
          { required: true, initial: [] }
        ),
        total: new fields.NumberField({ required: true, initial: 0, integer: true })
      }),
      proficiencyKey: new fields.StringField({ required: false }),
      proficiencyType: new fields.StringField({ required: true, initial: '' })

    });
  }

  override async applyGrant(actor: typeof Actor): Promise<void> { }

  override async configureGrant(actor: typeof Actor): Promise<void> { }
}
