import A5EDataModel from '../A5EDataModel';
import SchemaDataModel from '../template/SchemaDataModel';

export default class ClassDataModel extends A5EDataModel.mixin(SchemaDataModel) {
  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      slug: new fields.StringField({ nullable: false, initial: '' }),
      description: new fields.HTMLField({ nullable: false, initial: '' }),
      classLevels: new fields.NumberField({
        nullable: false, initial: 0, min: 0, max: 20
      }),
      hp: new fields.SchemaField({
        hitDiceSize: new fields.NumberField({
          nullable: false, initial: 6, min: 4, max: 20
        }),
        hitDiceUsed: new fields.NumberField({ nullable: false, initial: 0, min: 0 }),
        levels: new fields.SchemaField(
          Array.from({ length: 20 }, (_, i) => i + 1)
            .reduce((acc, level) => {
              acc[level] = new fields.NumberField({ nullable: false, initial: 0, min: 0 });
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
                acc[level] = new fields.StringField({ nullable: false, initial: 0, min: 0 });
                return acc;
              }, {})
          ),
          recovery: new fields.StringField({ required: true, initial: '' }),
          type: new fields.StringField({
            nullable: false,
            initial: '',
            choices: ['number', 'dice', 'string']
          })
        })
      ),
      source: new fields.StringField({ nullable: false, initial: '' }),
      spellcasting: new fields.SchemaField({
        ability: new fields.SchemaField({
          base: new fields.StringField({ nullable: false, initial: 'none' }),
          options: new fields.ArrayField(
            new fields.StringField({ nullable: false, initial: 'none' }),
            { nullable: false, initial: [] }
          ),
          value: new fields.StringField({ nullable: false, initial: 'none' })
        }),
        casterType: new fields.StringField({ nullable: false, initial: 'none' }),
        knownCantrips: new fields.SchemaField(
          Array.from({ length: 20 }, (_, i) => i + 1)
            .reduce((acc, level) => {
              acc[level] = new fields.NumberField({ nullable: false, initial: 0, min: 0 });
              return acc;
            }, {})
        ),
        knownSpells: new fields.SchemaField(
          Array.from({ length: 20 }, (_, i) => i + 1)
            .reduce((acc, level) => {
              acc[level] = new fields.NumberField({ nullable: false, initial: 0, min: 0 });
              return acc;
            }, {})
        )
      }),
      wealth: new fields.StringField({ nullable: false, initial: '' })
    });
  }
}
