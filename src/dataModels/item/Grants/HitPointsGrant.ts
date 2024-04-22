import BaseGrant from './BaseGrant';

export default class HitPointsGrant extends BaseGrant {
  #configComponent = null;

  #type = 'hitPoint';

  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({ required: true, initial: 'hitPoint' }),
      bonus: new fields.StringField({ required: true, initial: '' }),
      context: new fields.SchemaField({ required: true, initial: 'hitPoint' }),
      label: new fields.StringField({ required: true, initial: 'New HitPoints Grant' })
    });
  }
}
