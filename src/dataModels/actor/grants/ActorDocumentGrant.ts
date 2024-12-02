/* eslint-disable max-classes-per-file */
import ActorBaseGrant from './ActorBaseGrant';

export class ActorFeatureGrant extends ActorBaseGrant {
  // Declare Schema Variables
  declare documentIds: string[];

  static override defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({ required: true, initial: 'feature' }),
      documentIds: new fields.ArrayField(
        new fields.StringField({ required: true, initial: '' }),
        { required: true, initial: [] }
      )
    });
  }
}

export class ActorItemGrant extends ActorBaseGrant {
  // Declare Schema Variables
  declare documentIds: string[];

  static override defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({ required: true, initial: 'item' }),
      documentIds: new fields.ArrayField(
        new fields.StringField({ required: true, initial: '' }),
        { required: true, initial: [] }
      )
    });
  }
}
