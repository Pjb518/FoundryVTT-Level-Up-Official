/* eslint-disable max-classes-per-file */
import A5EDataModel from '../A5EDataModel';

class ActorBaseGrant extends A5EDataModel {
  constructor(data: any, options: any = {}) {
    // @ts-ignore
    super(data, options);
  }

  static defineSchema() {
    const { fields } = foundry.data;

    return {
      // TODO: Update to UUIDField in v12
      itemUuid: new fields.StringField({ required: true, initial: '' }),
      // itemUuid: new fields.DocumentUUIDField({ required: true, initial: '' }),
      grantId: new fields.DocumentIdField({ required: true, initial: '' }),
      grantType: new fields.StringField({ required: true, initial: '' })
    };
  }
}

class BonusGrant extends ActorBaseGrant {
  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({ required: true, initial: 'bonus' }),
      bonusId: new fields.DocumentIdField({ required: true, initial: '' }),
      type: new fields.StringField({ required: true, initial: '' })
    });
  }
}

class FeatureGrant extends ActorBaseGrant {
  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({ required: true, initial: 'feature' }),
      documentIds: new fields.ArrayField(
        new fields.DocumentIdField({ required: true, initial: '' }),
        { required: true, initial: [] }
      )
    });
  }
}

class ItemGrant extends ActorBaseGrant {
  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({ required: true, initial: 'item' }),
      documentIds: new fields.ArrayField(
        new fields.DocumentIdField({ required: true, initial: '' }),
        { required: true, initial: [] }
      )
    });
  }
}

class ProficiencyGrant extends ActorBaseGrant {
  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({ required: true, initial: 'proficiency' }),
      proficiencyData: new fields.SchemaField({
        keys: new fields.ArrayField(
          new fields.StringField({ required: true, initial: '' }),
          { required: true, initial: [] }
        ),
        total: new fields.NumberField({ required: true, initial: 0, integer: true }),
        proficiencyType: new fields.StringField({ required: true, initial: '' })
      })
    });
  }
}

class TraitGrant extends ActorBaseGrant {
  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({ required: true, initial: 'trait' }),
      traitData: new fields.SchemaField({
        traits: new fields.ArrayField(
          new fields.StringField({ required: true, initial: '' }),
          { required: true, initial: [] }
        ),
        total: new fields.NumberField({ required: true, initial: 0, integer: true }),
        traitType: new fields.StringField({ required: true, initial: '' })
      })
    });
  }
}

export default {
  base: ActorBaseGrant,
  bonus: BonusGrant,
  feature: FeatureGrant,
  item: ItemGrant,
  proficiency: ProficiencyGrant,
  trait: TraitGrant
};
