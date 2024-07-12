import { A5EBaseItemData } from './base';

const { fields } = foundry.data;

const schema = {
  slug: new fields.StringField({ nullable: false, initial: '' }),
  archetypeLevel: new fields.NumberField({
    required: true, nullable: false, initial: 3, min: 0, max: 20
  }),
  classLevels: new fields.NumberField({
    required: true, nullable: false, initial: 0, min: 0, max: 20
  }),
  hp: new fields.SchemaField({
    hitDiceSize: new fields.NumberField({
      required: true, nullable: false, initial: 6, min: 4, max: 20
    }),
    hitDiceUsed: new fields.NumberField({
      required: true, nullable: false, initial: 0, min: 0
    }),
    levels: new fields.SchemaField(
      Array.from({ length: 20 }, (_, i) => i + 1)
        .reduce((acc, level) => {
          acc[level] = new fields.NumberField({
            required: true, nullable: false, initial: 0, min: 0
          });
          return acc;
        }, {})
    )
  }),
  grants: new fields.ObjectField({
    nullable: false,
    initial: () => ({
      [foundry.utils.randomID()]: {
        grantType: 'proficiency',
        keys: {
          base: [],
          options: [],
          total: 0
        },
        proficiencyType: 'armor',
        label: 'Armor Proficiencies',
        levelType: 'class'
      },
      [foundry.utils.randomID()]: {
        grantType: 'proficiency',
        keys: {
          base: [],
          options: [],
          total: 0
        },
        proficiencyType: 'weapon',
        label: 'Weapon Proficiencies',
        levelType: 'class'
      },
      [foundry.utils.randomID()]: {
        grantType: 'proficiency',
        keys: {
          base: [],
          options: [],
          total: 0
        },
        proficiencyType: 'tool',
        label: 'Tool Proficiencies',
        levelType: 'character'
      },
      [foundry.utils.randomID()]: {
        grantType: 'proficiency',
        keys: {
          base: [],
          options: [],
          total: 0
        },
        proficiencyType: 'savingThrow',
        isExpertise: false,
        label: 'Saving Throw Proficiencies',
        levelType: 'character'
      },
      [foundry.utils.randomID()]: {
        grantType: 'proficiency',
        keys: {
          base: [],
          options: [],
          total: 0
        },
        proficiencyType: 'skill',
        isExpertise: false,
        label: 'Skill Proficiencies',
        levelType: 'character'
      },
      [foundry.utils.randomID()]: {
        grantType: 'feature',
        features: {
          base: [],
          options: [],
          total: 0
        },
        label: '1st Level Class Features',
        levelType: 'class'
      },
      [foundry.utils.randomID()]: {
        grantType: 'item',
        items: {
          base: [],
          options: [],
          total: 0
        },
        label: 'Starting Equipment',
        levelType: 'character',
        optional: true
      }
    })
  }),
  resources: new fields.ArrayField(
    new fields.SchemaField({
      name: new fields.StringField({ nullable: false, initial: 'New Resource' }),
      reference: new fields.SchemaField(
        Array.from({ length: 20 }, (_, i) => i + 1)
          .reduce((acc, level) => {
            acc[level] = new fields.StringField({ required: true, initial: '' });
            return acc;
          }, {})
      ),
      recovery: new fields.StringField({ nullable: false, initial: 'longRest' }),
      slug: new fields.StringField({ nullable: false, initial: '' })
    }),
    { nullable: false, initial: [] }
  ),
  spellcasting: new fields.SchemaField({
    ability: new fields.SchemaField({
      base: new fields.StringField({ nullable: false, initial: 'none' }),
      options: new fields.ArrayField(
        new fields.StringField({ nullable: false, initial: 'none' }),
        { nullable: false, initial: [] }
      ),
      value: new fields.StringField({ nullable: false, initial: 'none' })
    }),
    casterType: new fields.StringField({ nullable: false, initial: 'none' })
  }),
  wealth: new fields.StringField({ nullable: false, initial: '' })
};

declare namespace A5EClassData {
  type Schema = A5EBaseItemData.Schema & typeof schema;
  type BaseData = A5EBaseItemData.BaseData;
  type DerivedData = A5EBaseItemData.DerivedData;
}

class A5EClassData extends A5EBaseItemData<
  A5EClassData.Schema,
  A5EClassData.BaseData,
  A5EClassData.DerivedData
> {
  /** @inheritDoc */
  static override defineSchema(): A5EClassData.Schema {
    return {
      ...super.defineSchema(),
      ...schema
    };
  }
}

// eslint-disable-next-line import/prefer-default-export
export { A5EClassData };
