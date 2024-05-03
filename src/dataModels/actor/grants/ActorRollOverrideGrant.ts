import ActorBaseGrant from './ActorBaseGrant';

export default class ActorRollOverrideGrant extends ActorBaseGrant {
  declare rollOverrideData: {
    keys: string[];
    total: number;
    rollOverrideType: string;
    rollMode: number;
  };

  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({ required: true, initial: 'rollOverride' }),
      rollOverrideData: new fields.SchemaField({
        keys: new fields.ArrayField(
          new fields.StringField({ required: true, initial: '' }),
          { required: true, initial: [] }
        ),
        total: new fields.NumberField({ nullable: false, initial: 0, integer: true }),
        rollOverrideType: new fields.StringField({ required: false, initial: 'abilityCheck' }),
        rollMode: new fields.NumberField({ nullable: false, initial: 0 })
      })
    });
  }
}
