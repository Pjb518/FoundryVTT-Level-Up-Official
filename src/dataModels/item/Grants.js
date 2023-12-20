/* eslint-disable max-classes-per-file */

import A5EDataModel from '../A5EDataModel';

export class BaseGrant extends A5EDataModel {
  constructor(data, options = {}) {
    super(data, options);
  }

  static defineSchema() {
    const { fields } = foundry.data;

    return {
      _id: new fields.DocumentIdField({ initial: () => foundry.utils.randomID() }),
      grantType: new fields.StringField({ required: true, initial: '' }),
      level: new fields.NumberField({ required: true, initial: 0, integer: true }),
      optional: new fields.BooleanField({ required: true, initial: false })
    };
  }

  static getApplyData() { return []; }
}

export class AbilityGrant extends BaseGrant {
  #type = 'ability';

  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({ required: true, initial: 'ability' }),
      abilities: new fields.ArrayField(
        fields.StringField({ required: true, initial: '' }),
        { required: true, initial: [] }
      ),
      bonus: new fields.NumberField({ required: true, initial: 0, integer: true })
    });
  }
}

export class MovementGrant extends BaseGrant {
  #type = 'movement';

  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({ required: true, initial: 'movement' }),
      movementMode: new fields.StringField({ required: true, initial: 'walk' }),
      ranges: new fields.SchemaField({
        base: new fields.SchemaField({
          distance: new fields.NumberField(
            { required: true, initial: 0, integer: true }
          ),
          unit: new fields.StringField({ required: true, initial: 'feet' })
        }),
        bonus: new fields.SchemaField({
          distance: new fields.NumberField(
            { required: true, initial: 0, integer: true }
          ),
          unit: new fields.StringField({ required: true, initial: 'feet' })
        })
      })
    });
  }
}

export class ProficiencyGrant extends BaseGrant {
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
}

export class SkillGrant extends BaseGrant {
  #type = 'skill';

  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({ required: true, initial: 'skill' }),
      skills: new fields.ArrayField(
        new fields.StringField({ required: true, initial: '' }),
        { required: true, initial: [] }
      )
    });
  }

  static getApplyData() {

  }
}

export class TraitGrant extends BaseGrant {
  #type = 'trait';

  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {

      grantType: new fields.StringField({ required: true, initial: 'trait' }),
      traitType: new fields.StringField({ required: true, initial: '' }),
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
      })
    });
  }
}

export class VisionGrant extends BaseGrant {
  #type = 'vision';

  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({ required: true, initial: 'vision' }),
      visionMode: new fields.StringField({ required: true, initial: 'darkvision' }),
      ranges: new fields.SchemaField({
        base: new fields.SchemaField({
          distance: new fields.NumberField(
            { required: true, initial: 0, integer: true }
          ),
          unit: new fields.StringField({ required: true, initial: 'feet' })
        }),
        bonus: new fields.SchemaField({
          distance: new fields.NumberField(
            { required: true, initial: 0, integer: true }
          ),
          unit: new fields.StringField({ required: true, initial: 'feet' })
        })
      })
    });
  }
}
