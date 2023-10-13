import A5EDataModel from '../A5EDataModel';
import SchemaDataModel from '../template/SchemaDataModel';

export default class BaseActorData extends A5EDataModel.mixin(SchemaDataModel) {
  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      abilities: new fields.SchemaField({
        str: new fields.SchemaField({
          value: new fields.NumberField({ required: true, initial: 10, integer: true }),
          check: new fields.SchemaField({
            expertiseDie: new fields.NumberField({ required: true, initial: 0, integer: true }),
            bonus: new fields.StringField({ required: true, initial: '' })
          }),
          save: new fields.SchemaField({
            proficient: new fields.BooleanField({ required: true, initial: false }),
            expertiseDie: new fields.NumberField({ required: true, initial: 0, integer: true }),
            bonus: new fields.StringField({ required: true, initial: '' })
          })
        }),
        dex: new fields.SchemaField({
          value: new fields.NumberField({ required: true, initial: 10, integer: true }),
          check: new fields.SchemaField({
            expertiseDie: new fields.NumberField({ required: true, initial: 0, integer: true }),
            bonus: new fields.StringField({ required: true, initial: '' })
          }),
          save: new fields.SchemaField({
            proficient: new fields.BooleanField({ required: true, initial: false }),
            expertiseDie: new fields.NumberField({ required: true, initial: 0, integer: true }),
            bonus: new fields.StringField({ required: true, initial: '' })
          })
        }),
        con: new fields.SchemaField({
          value: new fields.NumberField({ required: true, initial: 10, integer: true }),
          check: new fields.SchemaField({
            expertiseDie: new fields.NumberField({ required: true, initial: 0, integer: true }),
            bonus: new fields.StringField({ required: true, initial: '' })
          }),
          save: new fields.SchemaField({
            proficient: new fields.BooleanField({ required: true, initial: false }),
            expertiseDie: new fields.NumberField({ required: true, initial: 0, integer: true }),
            bonus: new fields.StringField({ required: true, initial: '' })
          })
        }),
        int: new fields.SchemaField({
          value: new fields.NumberField({ required: true, initial: 10, integer: true }),
          check: new fields.SchemaField({
            expertiseDie: new fields.NumberField({ required: true, initial: 0, integer: true }),
            bonus: new fields.StringField({ required: true, initial: '' })
          }),
          save: new fields.SchemaField({
            proficient: new fields.BooleanField({ required: true, initial: false }),
            expertiseDie: new fields.NumberField({ required: true, initial: 0, integer: true }),
            bonus: new fields.StringField({ required: true, initial: '' })
          })
        }),
        wis: new fields.SchemaField({
          value: new fields.NumberField({ required: true, initial: 10, integer: true }),
          check: new fields.SchemaField({
            expertiseDie: new fields.NumberField({ required: true, initial: 0, integer: true }),
            bonus: new fields.StringField({ required: true, initial: '' })
          }),
          save: new fields.SchemaField({
            proficient: new fields.BooleanField({ required: true, initial: false }),
            expertiseDie: new fields.NumberField({ required: true, initial: 0, integer: true }),
            bonus: new fields.StringField({ required: true, initial: '' })
          })
        }),
        cha: new fields.SchemaField({
          value: new fields.NumberField({ required: true, initial: 10, integer: true }),
          check: new fields.SchemaField({
            expertiseDie: new fields.NumberField({ required: true, initial: 0, integer: true }),
            bonus: new fields.StringField({ required: true, initial: '' })
          }),
          save: new fields.SchemaField({
            proficient: new fields.BooleanField({ required: true, initial: false }),
            expertiseDie: new fields.NumberField({ required: true, initial: 0, integer: true }),
            bonus: new fields.StringField({ required: true, initial: '' })
          })
        })
      }),
      attributes: new fields.SchemaField({
        ac: new fields.SchemaField({
          baseFormula: new fields.StringField({ required: true, initial: '10 + @dex.mod' }),
          value: new fields.NumberField({ required: true, initial: 0, integer: true })
        }),
        death: new fields.SchemaField({
          success: new fields.NumberField({ required: true, initial: 0, integer: true }),
          failure: new fields.NumberField({ required: true, initial: 0, integer: true })
        }),
        hp: new fields.SchemaField({
          value: new fields.NumberField({ required: true, initial: 10, integer: true }),
          baseMax: new fields.NumberField({ required: true, initial: 10, integer: true }),
          temp: new fields.NumberField({ required: true, initial: 0, integer: true }),
          bonus: new fields.NumberField({ required: true, initial: 0, integer: true })
        }),
        hitDice: new fields.ObjectField(),
        initiative: new fields.SchemaField({
          bonus: new fields.StringField({ required: true, initial: '' }),
          expertiseDie: new fields.NumberField({ required: true, initial: 0, integer: true })
        }),
        movement: new fields.ObjectField(),
        senses: new fields.ObjectField(),
        inspiration: new fields.BooleanField({ required: true, initial: false }),
        fatigue: new fields.NumberField({ required: true, initial: 0, integer: true }),
        strife: new fields.NumberField({ required: true, initial: 0, integer: true }),
        spellcasting: new fields.StringField({ required: true, initial: 'int' })
      }),
      bonuses: new fields.SchemaField({
        abilities: new fields.SchemaField({
          check: new fields.StringField({ required: true, initial: '' }),
          save: new fields.StringField({ required: true, initial: '' }),
          skill: new fields.StringField({ required: true, initial: '' })
        }),
        damage: new fields.ObjectField(),
        healing: new fields.ObjectField(),
        maneuverDC: new fields.StringField({ required: true, initial: '' }),
        meleeSpellAttack: new fields.StringField({ required: true, initial: '' }),
        meleeWeaponAttack: new fields.StringField({ required: true, initial: '' }),
        rangedSpellAttack: new fields.StringField({ required: true, initial: '' }),
        rangedWeaponAttack: new fields.StringField({ required: true, initial: '' }),
        spellDC: new fields.StringField({ required: true, initial: '' })
      }),
      currency: new fields.SchemaField({
        cp: new fields.NumberField({ required: true, initial: 0, integer: true }),
        sp: new fields.NumberField({ required: true, initial: 0, integer: true }),
        ep: new fields.NumberField({ required: true, initial: 0, integer: true }),
        gp: new fields.NumberField({ required: true, initial: 0, integer: true }),
        pp: new fields.NumberField({ required: true, initial: 0, integer: true })
      }),
      details: new fields.SchemaField({
        bio: new fields.StringField({ required: true, initial: '' }),
        creatureTypes: new fields.ArrayField(
          new fields.StringField({ required: true, initial: '' }),
          { required: true, initial: [] }
        ),
        isSwarm: new fields.BooleanField({ required: true, initial: false })
      }),
      proficiencies: new fields.SchemaField({
        armor: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), { required: true, initial: [] }),
        languages: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), { required: true, initial: [] }),
        tools: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), { required: true, initial: [] }),
        weapons: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), { required: true, initial: [] })
      }),
      resources: new fields.SchemaField({
        primary: new fields.SchemaField({
          label: new fields.StringField({ required: true, initial: '' }),
          value: new fields.NumberField({ required: true, initial: 0, integer: true }),
          max: new fields.StringField({ required: true, initial: '' }),
          per: new fields.StringField({ required: true, initial: '' }),
          hideMax: new fields.BooleanField({ required: true, initial: false }),
          recharge: new fields.SchemaField({
            formula: new fields.StringField({ required: true, initial: '' }),
            threshold: new fields.NumberField({ required: true, initial: 0, integer: true })
          })
        }),
        secondary: new fields.SchemaField({
          label: new fields.StringField({ required: true, initial: '' }),
          value: new fields.NumberField({ required: true, initial: 0, integer: true }),
          max: new fields.StringField({ required: true, initial: '' }),
          per: new fields.StringField({ required: true, initial: '' }),
          hideMax: new fields.BooleanField({ required: true, initial: false }),
          recharge: new fields.SchemaField({
            formula: new fields.StringField({ required: true, initial: '' }),
            threshold: new fields.NumberField({ required: true, initial: 0, integer: true })
          })
        }),
        tertiary: new fields.SchemaField({
          label: new fields.StringField({ required: true, initial: '' }),
          value: new fields.NumberField({ required: true, initial: 0, integer: true }),
          max: new fields.StringField({ required: true, initial: '' }),
          per: new fields.StringField({ required: true, initial: '' }),
          hideMax: new fields.BooleanField({ required: true, initial: false }),
          recharge: new fields.SchemaField({
            formula: new fields.StringField({ required: true, initial: '' }),
            threshold: new fields.NumberField({ required: true, initial: 0, integer: true })
          })
        }),
        quaternary: new fields.SchemaField({
          label: new fields.StringField({ required: true, initial: '' }),
          value: new fields.NumberField({ required: true, initial: 0, integer: true }),
          max: new fields.StringField({ required: true, initial: '' }),
          per: new fields.StringField({ required: true, initial: '' }),
          hideMax: new fields.BooleanField({ required: true, initial: false }),
          recharge: new fields.SchemaField({
            formula: new fields.StringField({ required: true, initial: '' }),
            threshold: new fields.NumberField({ required: true, initial: 0, integer: true })
          })
        })
      }),
      skills: new fields.ObjectField(),
      source: new fields.SchemaField({
        name: new fields.StringField({ required: true, initial: '' }),
        link: new fields.StringField({ required: true, initial: '' }),
        publisher: new fields.StringField({ required: true, initial: '' })
      }),
      traits: new fields.SchemaField({
        size: new fields.StringField({ required: true, initial: '' }),
        conditionImmunities: new fields.ArrayField(
          new fields.StringField({ required: true, initial: '' }),
          { required: true, initial: [] }
        ),
        damageImmunities: new fields.ArrayField(
          new fields.StringField({ required: true, initial: '' }),
          { required: true, initial: [] }
        ),
        damageResistances: new fields.ArrayField(
          new fields.StringField({ required: true, initial: '' }),
          { required: true, initial: [] }
        ),
        damageVulnerabilities: new fields.ArrayField(
          new fields.StringField({ required: true, initial: '' }),
          { required: true, initial: [] }
        )
      }),
      spellResources: new fields.ObjectField()
    });
  }
}
