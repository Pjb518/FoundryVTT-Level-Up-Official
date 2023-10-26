/* eslint-disable max-classes-per-file */

import A5EDataModel from '../A5EDataModel';

export class BaseGrant extends A5EDataModel {
  constructor(data, options = {}) {
    super(data, options);
  }

  static defineSchema() {
    return {
      _id: new foundry.data.fields.DocumentIdField({ initial: () => foundry.utils.randomID() }),
      grantType: new foundry.data.fields.StringField({ required: true, initial: '' }),
      level: new foundry.data.fields.NumberField({ required: true, initial: 0, integer: true }),
      optional: new foundry.data.fields.BooleanField({ required: true, initial: false })
    };
  }

  static getApplyData() { return []; }
}

export class SkillGrant extends BaseGrant {
  #type = 'skill';

  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      grantType: new foundry.data.fields.StringField({ required: true, initial: 'skill' }),
      skill: new foundry.data.fields.StringField({ required: true, initial: '' })
    });
  }

  static getApplyData() {

  }
}

export class MovementGrant extends BaseGrant {
  #type = 'movement';

  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      grantType: new foundry.data.fields.StringField({ required: true, initial: 'movement' }),
      movementMode: new foundry.data.fields.StringField({ required: true, initial: 'walk' }),
      ranges: new foundry.data.fields.SchemaField({
        base: new foundry.data.fields.SchemaField({
          distance: new foundry.data.fields.NumberField(
            { required: true, initial: 0, integer: true }
          ),
          unit: new foundry.data.fields.StringField({ required: true, initial: 'feet' })
        }),
        bonus: new foundry.data.fields.SchemaField({
          distance: new foundry.data.fields.NumberField(
            { required: true, initial: 0, integer: true }
          ),
          unit: new foundry.data.fields.StringField({ required: true, initial: 'feet' })
        })
      })
    });
  }
}

export class ProficiencyGrant extends BaseGrant {
  #type = 'proficiency';

  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      grantType: new foundry.data.fields.StringField({ required: true, initial: 'proficiency' }),
      choices: new foundry.data.fields.SchemaField({
        base: new foundry.data.fields.ArrayField(
          new foundry.data.fields.StringField({ nullable: false, initial: '' }),
          { required: true, initial: [] }
        ),
        options: new foundry.data.fields.ArrayField(
          new foundry.data.fields.StringField({ nullable: false, initial: '' }),
          { required: true, initial: [] }
        ),
        total: new foundry.data.fields.NumberField({ required: true, initial: 0, integer: true })
      }),
      proficiencyKey: new foundry.data.fields.StringField({ required: false }),
      proficiencyType: new foundry.data.fields.StringField({ required: true, initial: '' })

    });
  }
}

export class TraitGrant extends BaseGrant {
  #type = 'trait';

  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      grantType: new foundry.data.fields.StringField({ required: true, initial: 'trait' }),
      traitType: new foundry.data.fields.StringField({ required: true, initial: '' }),
      choices: new foundry.data.fields.SchemaField({
        base: new foundry.data.fields.ArrayField(
          new foundry.data.fields.StringField({ nullable: false, initial: '' }),
          { required: true, initial: [] }
        ),
        options: new foundry.data.fields.ArrayField(
          new foundry.data.fields.StringField({ nullable: false, initial: '' }),
          { required: true, initial: [] }
        ),
        total: new foundry.data.fields.NumberField({ required: true, initial: 0, integer: true })
      })
    });
  }
}

export class VisionGrant extends BaseGrant {
  #type = 'vision';

  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      grantType: new foundry.data.fields.StringField({ required: true, initial: 'vision' }),
      visionMode: new foundry.data.fields.StringField({ required: true, initial: 'darkvision' }),
      ranges: new foundry.data.fields.SchemaField({
        base: new foundry.data.fields.SchemaField({
          distance: new foundry.data.fields.NumberField(
            { required: true, initial: 0, integer: true }
          ),
          unit: new foundry.data.fields.StringField({ required: true, initial: 'feet' })
        }),
        bonus: new foundry.data.fields.SchemaField({
          distance: new foundry.data.fields.NumberField(
            { required: true, initial: 0, integer: true }
          ),
          unit: new foundry.data.fields.StringField({ required: true, initial: 'feet' })
        })
      })
    });
  }
}
