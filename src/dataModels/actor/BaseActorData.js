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
            expertiseDice: new fields.NumberField({ required: true, initial: 0, integer: true }),
            bonus: new fields.StringField({ required: true, initial: '' })
          }),
          save: new fields.SchemaField({
            proficient: new fields.BooleanField({ required: true, initial: false }),
            expertiseDice: new fields.NumberField({ required: true, initial: 0, integer: true }),
            bonus: new fields.StringField({ required: true, initial: '' })
          })
        }),
        dex: new fields.SchemaField({
          value: new fields.NumberField({ required: true, initial: 10, integer: true }),
          check: new fields.SchemaField({
            expertiseDice: new fields.NumberField({ required: true, initial: 0, integer: true }),
            bonus: new fields.StringField({ required: true, initial: '' })
          }),
          save: new fields.SchemaField({
            proficient: new fields.BooleanField({ required: true, initial: false }),
            expertiseDice: new fields.NumberField({ required: true, initial: 0, integer: true }),
            bonus: new fields.StringField({ required: true, initial: '' })
          })
        }),
        con: new fields.SchemaField({
          value: new fields.NumberField({ required: true, initial: 10, integer: true }),
          check: new fields.SchemaField({
            expertiseDice: new fields.NumberField({ required: true, initial: 0, integer: true }),
            bonus: new fields.StringField({ required: true, initial: '' })
          }),
          save: new fields.SchemaField({
            proficient: new fields.BooleanField({ required: true, initial: false }),
            expertiseDice: new fields.NumberField({ required: true, initial: 0, integer: true }),
            bonus: new fields.StringField({ required: true, initial: '' })
          })
        }),
        int: new fields.SchemaField({
          value: new fields.NumberField({ required: true, initial: 10, integer: true }),
          check: new fields.SchemaField({
            expertiseDice: new fields.NumberField({ required: true, initial: 0, integer: true }),
            bonus: new fields.StringField({ required: true, initial: '' })
          }),
          save: new fields.SchemaField({
            proficient: new fields.BooleanField({ required: true, initial: false }),
            expertiseDice: new fields.NumberField({ required: true, initial: 0, integer: true }),
            bonus: new fields.StringField({ required: true, initial: '' })
          })
        }),
        wis: new fields.SchemaField({
          value: new fields.NumberField({ required: true, initial: 10, integer: true }),
          check: new fields.SchemaField({
            expertiseDice: new fields.NumberField({ required: true, initial: 0, integer: true }),
            bonus: new fields.StringField({ required: true, initial: '' })
          }),
          save: new fields.SchemaField({
            proficient: new fields.BooleanField({ required: true, initial: false }),
            expertiseDice: new fields.NumberField({ required: true, initial: 0, integer: true }),
            bonus: new fields.StringField({ required: true, initial: '' })
          })
        }),
        cha: new fields.SchemaField({
          value: new fields.NumberField({ required: true, initial: 10, integer: true }),
          check: new fields.SchemaField({
            expertiseDice: new fields.NumberField({ required: true, initial: 0, integer: true }),
            bonus: new fields.StringField({ required: true, initial: '' })
          }),
          save: new fields.SchemaField({
            proficient: new fields.BooleanField({ required: true, initial: false }),
            expertiseDice: new fields.NumberField({ required: true, initial: 0, integer: true }),
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
        hitDice: new fields.SchemaField({
          d6: new fields.SchemaField({
            current: new fields.NumberField({
              required: true, initial: 0, integer: true, min: 0
            }),
            total: new fields.NumberField({
              required: true, initial: 0, integer: true, min: 0
            })
          }),
          d8: new fields.SchemaField({
            current: new fields.NumberField({
              required: true, initial: 0, integer: true, min: 0
            }),
            total: new fields.NumberField({
              required: true, initial: 0, integer: true, min: 0
            })
          }),
          d10: new fields.SchemaField({
            current: new fields.NumberField({
              required: true, initial: 0, integer: true, min: 0
            }),
            total: new fields.NumberField({
              required: true, initial: 0, integer: true, min: 0
            })
          }),
          d12: new fields.SchemaField({
            current: new fields.NumberField({
              required: true, initial: 0, integer: true, min: 0
            }),
            total: new fields.NumberField({
              required: true, initial: 0, integer: true, min: 0
            })
          })
        }),
        initiative: new fields.SchemaField({
          bonus: new fields.StringField({ required: true, initial: '' }),
          expertiseDice: new fields.NumberField({ required: true, initial: 0, integer: true })
        }),
        movement: new fields.SchemaField({
          burrow: new fields.SchemaField({
            distance: new fields.NumberField({
              required: true, initial: 0, integer: true, min: 0
            }),
            unit: new fields.StringField({ required: true, initial: 'feet' })
          }),
          climb: new fields.SchemaField({
            distance: new fields.NumberField({
              required: true, initial: 0, integer: true, min: 0
            }),
            unit: new fields.StringField({ required: true, initial: 'feet' })
          }),
          fly: new fields.SchemaField({
            distance: new fields.NumberField({
              required: true, initial: 0, integer: true, min: 0
            }),
            unit: new fields.StringField({ required: true, initial: 'feet' })
          }),
          swim: new fields.SchemaField({
            distance: new fields.NumberField({
              required: true, initial: 0, integer: true, min: 0
            }),
            unit: new fields.StringField({ required: true, initial: 'feet' })
          }),
          walk: new fields.SchemaField({
            distance: new fields.NumberField({
              required: true, initial: 0, integer: true, min: 0
            }),
            unit: new fields.StringField({ required: true, initial: 'feet' })
          }),
          traits: new fields.SchemaField({
            hover: new fields.BooleanField({ required: true, initial: false })
          })
        }),
        senses: new fields.SchemaField({
          blindsight: new fields.SchemaField({
            distance: new fields.NumberField({
              required: true, initial: 0, integer: true, min: 0
            }),
            unit: new fields.StringField({ required: true, initial: 'feet' }),
            otherwiseBlind: new fields.BooleanField({ required: true, initial: false })
          }),
          darkvision: new fields.SchemaField({
            distance: new fields.NumberField({
              required: true, initial: 0, integer: true, min: 0
            }),
            unit: new fields.StringField({ required: true, initial: 'feet' })
          }),
          tremorsense: new fields.SchemaField({
            distance: new fields.NumberField({
              required: true, initial: 0, integer: true, min: 0
            }),
            unit: new fields.StringField({ required: true, initial: 'feet' })
          }),
          truesight: new fields.SchemaField({
            distance: new fields.NumberField({
              required: true, initial: 0, integer: true, min: 0
            }),
            unit: new fields.StringField({ required: true, initial: 'feet' })
          })
        }),
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
            formula: new fields.StringField({ required: true, initial: '1d6' }),
            threshold: new fields.NumberField({ required: true, initial: 6, integer: true })
          })
        }),
        secondary: new fields.SchemaField({
          label: new fields.StringField({ required: true, initial: '' }),
          value: new fields.NumberField({ required: true, initial: 0, integer: true }),
          max: new fields.StringField({ required: true, initial: '' }),
          per: new fields.StringField({ required: true, initial: '' }),
          hideMax: new fields.BooleanField({ required: true, initial: false }),
          recharge: new fields.SchemaField({
            formula: new fields.StringField({ required: true, initial: '1d6' }),
            threshold: new fields.NumberField({ required: true, initial: 6, integer: true })
          })
        }),
        tertiary: new fields.SchemaField({
          label: new fields.StringField({ required: true, initial: '' }),
          value: new fields.NumberField({ required: true, initial: 0, integer: true }),
          max: new fields.StringField({ required: true, initial: '' }),
          per: new fields.StringField({ required: true, initial: '' }),
          hideMax: new fields.BooleanField({ required: true, initial: false }),
          recharge: new fields.SchemaField({
            formula: new fields.StringField({ required: true, initial: '1d6' }),
            threshold: new fields.NumberField({ required: true, initial: 6, integer: true })
          })
        }),
        quaternary: new fields.SchemaField({
          label: new fields.StringField({ required: true, initial: '' }),
          value: new fields.NumberField({ required: true, initial: 0, integer: true }),
          max: new fields.StringField({ required: true, initial: '' }),
          per: new fields.StringField({ required: true, initial: '' }),
          hideMax: new fields.BooleanField({ required: true, initial: false }),
          recharge: new fields.SchemaField({
            formula: new fields.StringField({ required: true, initial: '1d6' }),
            threshold: new fields.NumberField({ required: true, initial: 6, integer: true })
          })
        })
      }),
      skills: new fields.SchemaField({
        acr: new fields.SchemaField({
          ability: new fields.StringField({ required: true, initial: 'dex' }),
          value: new fields.NumberField({ required: true, initial: 0, integer: true }),
          proficient: new fields.BooleanField({ required: true, initial: false }),
          specialties: new fields.ArrayField(
            new fields.StringField({ required: true, initial: '' }),
            { required: true, initial: [] }
          ),
          expertiseDice: new fields.NumberField({ required: true, initial: 0, integer: true }),
          minRoll: new fields.NumberField({
            required: true,
            initial: 1,
            integer: true,
            min: 1,
            max: 20
          }),
          bonuses: new fields.SchemaField({
            check: new fields.StringField({ required: true, initial: '' }),
            passive: new fields.NumberField({ required: true, initial: 0, integer: true })
          })
        }),
        ani: new fields.SchemaField({
          ability: new fields.StringField({ required: true, initial: 'wis' }),
          value: new fields.NumberField({ required: true, initial: 0, integer: true }),
          proficient: new fields.BooleanField({ required: true, initial: false }),
          specialties: new fields.ArrayField(
            new fields.StringField({ required: true, initial: '' }),
            { required: true, initial: [] }
          ),
          expertiseDice: new fields.NumberField({ required: true, initial: 0, integer: true }),
          minRoll: new fields.NumberField({
            required: true,
            initial: 1,
            integer: true,
            min: 1,
            max: 20
          }),
          bonuses: new fields.SchemaField({
            check: new fields.StringField({ required: true, initial: '' }),
            passive: new fields.NumberField({ required: true, initial: 0, integer: true })
          })
        }),
        arc: new fields.SchemaField({
          ability: new fields.StringField({ required: true, initial: 'int' }),
          value: new fields.NumberField({ required: true, initial: 0, integer: true }),
          proficient: new fields.BooleanField({ required: true, initial: false }),
          specialties: new fields.ArrayField(
            new fields.StringField({ required: true, initial: '' }),
            { required: true, initial: [] }
          ),
          expertiseDice: new fields.NumberField({ required: true, initial: 0, integer: true }),
          minRoll: new fields.NumberField({
            required: true,
            initial: 1,
            integer: true,
            min: 1,
            max: 20
          }),
          bonuses: new fields.SchemaField({
            check: new fields.StringField({ required: true, initial: '' }),
            passive: new fields.NumberField({ required: true, initial: 0, integer: true })
          })
        }),
        ath: new fields.SchemaField({
          ability: new fields.StringField({ required: true, initial: 'str' }),
          value: new fields.NumberField({ required: true, initial: 0, integer: true }),
          proficient: new fields.BooleanField({ required: true, initial: false }),
          specialties: new fields.ArrayField(
            new fields.StringField({ required: true, initial: '' }),
            { required: true, initial: [] }
          ),
          expertiseDice: new fields.NumberField({ required: true, initial: 0, integer: true }),
          minRoll: new fields.NumberField({
            required: true,
            initial: 1,
            integer: true,
            min: 1,
            max: 20
          }),
          bonuses: new fields.SchemaField({
            check: new fields.StringField({ required: true, initial: '' }),
            passive: new fields.NumberField({ required: true, initial: 0, integer: true })
          })
        }),
        cul: new fields.SchemaField({
          ability: new fields.StringField({ required: true, initial: 'int' }),
          value: new fields.NumberField({ required: true, initial: 0, integer: true }),
          proficient: new fields.BooleanField({ required: true, initial: false }),
          specialties: new fields.ArrayField(
            new fields.StringField({ required: true, initial: '' }),
            { required: true, initial: [] }
          ),
          expertiseDice: new fields.NumberField({ required: true, initial: 0, integer: true }),
          minRoll: new fields.NumberField({
            required: true,
            initial: 1,
            integer: true,
            min: 1,
            max: 20
          }),
          bonuses: new fields.SchemaField({
            check: new fields.StringField({ required: true, initial: '' }),
            passive: new fields.NumberField({ required: true, initial: 0, integer: true })
          })
        }),
        dec: new fields.SchemaField({
          ability: new fields.StringField({ required: true, initial: 'cha' }),
          value: new fields.NumberField({ required: true, initial: 0, integer: true }),
          proficient: new fields.BooleanField({ required: true, initial: false }),
          specialties: new fields.ArrayField(
            new fields.StringField({ required: true, initial: '' }),
            { required: true, initial: [] }
          ),
          expertiseDice: new fields.NumberField({ required: true, initial: 0, integer: true }),
          minRoll: new fields.NumberField({
            required: true,
            initial: 1,
            integer: true,
            min: 1,
            max: 20
          }),
          bonuses: new fields.SchemaField({
            check: new fields.StringField({ required: true, initial: '' }),
            passive: new fields.NumberField({ required: true, initial: 0, integer: true })
          })
        }),
        eng: new fields.SchemaField({
          ability: new fields.StringField({ required: true, initial: 'int' }),
          value: new fields.NumberField({ required: true, initial: 0, integer: true }),
          proficient: new fields.BooleanField({ required: true, initial: false }),
          specialties: new fields.ArrayField(
            new fields.StringField({ required: true, initial: '' }),
            { required: true, initial: [] }
          ),
          expertiseDice: new fields.NumberField({ required: true, initial: 0, integer: true }),
          minRoll: new fields.NumberField({
            required: true,
            initial: 1,
            integer: true,
            min: 1,
            max: 20
          }),
          bonuses: new fields.SchemaField({
            check: new fields.StringField({ required: true, initial: '' }),
            passive: new fields.NumberField({ required: true, initial: 0, integer: true })
          })
        }),
        his: new fields.SchemaField({
          ability: new fields.StringField({ required: true, initial: 'int' }),
          value: new fields.NumberField({ required: true, initial: 0, integer: true }),
          proficient: new fields.BooleanField({ required: true, initial: false }),
          specialties: new fields.ArrayField(
            new fields.StringField({ required: true, initial: '' }),
            { required: true, initial: [] }
          ),
          expertiseDice: new fields.NumberField({ required: true, initial: 0, integer: true }),
          minRoll: new fields.NumberField({
            required: true,
            initial: 1,
            integer: true,
            min: 1,
            max: 20
          }),
          bonuses: new fields.SchemaField({
            check: new fields.StringField({ required: true, initial: '' }),
            passive: new fields.NumberField({ required: true, initial: 0, integer: true })
          })
        }),
        ins: new fields.SchemaField({
          ability: new fields.StringField({ required: true, initial: 'wis' }),
          value: new fields.NumberField({ required: true, initial: 0, integer: true }),
          proficient: new fields.BooleanField({ required: true, initial: false }),
          specialties: new fields.ArrayField(
            new fields.StringField({ required: true, initial: '' }),
            { required: true, initial: [] }
          ),
          expertiseDice: new fields.NumberField({ required: true, initial: 0, integer: true }),
          minRoll: new fields.NumberField({
            required: true,
            initial: 1,
            integer: true,
            min: 1,
            max: 20
          }),
          bonuses: new fields.SchemaField({
            check: new fields.StringField({ required: true, initial: '' }),
            passive: new fields.NumberField({ required: true, initial: 0, integer: true })
          })
        }),
        itm: new fields.SchemaField({
          ability: new fields.StringField({ required: true, initial: 'cha' }),
          value: new fields.NumberField({ required: true, initial: 0, integer: true }),
          proficient: new fields.BooleanField({ required: true, initial: false }),
          specialties: new fields.ArrayField(
            new fields.StringField({ required: true, initial: '' }),
            { required: true, initial: [] }
          ),
          expertiseDice: new fields.NumberField({ required: true, initial: 0, integer: true }),
          minRoll: new fields.NumberField({
            required: true,
            initial: 1,
            integer: true,
            min: 1,
            max: 20
          }),
          bonuses: new fields.SchemaField({
            check: new fields.StringField({ required: true, initial: '' }),
            passive: new fields.NumberField({ required: true, initial: 0, integer: true })
          })
        }),
        inv: new fields.SchemaField({
          ability: new fields.StringField({ required: true, initial: 'int' }),
          value: new fields.NumberField({ required: true, initial: 0, integer: true }),
          proficient: new fields.BooleanField({ required: true, initial: false }),
          specialties: new fields.ArrayField(
            new fields.StringField({ required: true, initial: '' }),
            { required: true, initial: [] }
          ),
          expertiseDice: new fields.NumberField({ required: true, initial: 0, integer: true }),
          minRoll: new fields.NumberField({
            required: true,
            initial: 1,
            integer: true,
            min: 1,
            max: 20
          }),
          bonuses: new fields.SchemaField({
            check: new fields.StringField({ required: true, initial: '' }),
            passive: new fields.NumberField({ required: true, initial: 0, integer: true })
          })
        }),
        med: new fields.SchemaField({
          ability: new fields.StringField({ required: true, initial: 'wis' }),
          value: new fields.NumberField({ required: true, initial: 0, integer: true }),
          proficient: new fields.BooleanField({ required: true, initial: false }),
          specialties: new fields.ArrayField(
            new fields.StringField({ required: true, initial: '' }),
            { required: true, initial: [] }
          ),
          expertiseDice: new fields.NumberField({ required: true, initial: 0, integer: true }),
          minRoll: new fields.NumberField({
            required: true,
            initial: 1,
            integer: true,
            min: 1,
            max: 20
          }),
          bonuses: new fields.SchemaField({
            check: new fields.StringField({ required: true, initial: '' }),
            passive: new fields.NumberField({ required: true, initial: 0, integer: true })
          })
        }),
        nat: new fields.SchemaField({
          ability: new fields.StringField({ required: true, initial: 'int' }),
          value: new fields.NumberField({ required: true, initial: 0, integer: true }),
          proficient: new fields.BooleanField({ required: true, initial: false }),
          specialties: new fields.ArrayField(
            new fields.StringField({ required: true, initial: '' }),
            { required: true, initial: [] }
          ),
          expertiseDice: new fields.NumberField({ required: true, initial: 0, integer: true }),
          minRoll: new fields.NumberField({
            required: true,
            initial: 1,
            integer: true,
            min: 1,
            max: 20
          }),
          bonuses: new fields.SchemaField({
            check: new fields.StringField({ required: true, initial: '' }),
            passive: new fields.NumberField({ required: true, initial: 0, integer: true })
          })
        }),
        prc: new fields.SchemaField({
          ability: new fields.StringField({ required: true, initial: 'wis' }),
          value: new fields.NumberField({ required: true, initial: 0, integer: true }),
          proficient: new fields.BooleanField({ required: true, initial: false }),
          specialties: new fields.ArrayField(
            new fields.StringField({ required: true, initial: '' }),
            { required: true, initial: [] }
          ),
          expertiseDice: new fields.NumberField({ required: true, initial: 0, integer: true }),
          minRoll: new fields.NumberField({
            required: true,
            initial: 1,
            integer: true,
            min: 1,
            max: 20
          }),
          bonuses: new fields.SchemaField({
            check: new fields.StringField({ required: true, initial: '' }),
            passive: new fields.NumberField({ required: true, initial: 0, integer: true })
          })
        }),
        prf: new fields.SchemaField({
          ability: new fields.StringField({ required: true, initial: 'cha' }),
          value: new fields.NumberField({ required: true, initial: 0, integer: true }),
          proficient: new fields.BooleanField({ required: true, initial: false }),
          specialties: new fields.ArrayField(
            new fields.StringField({ required: true, initial: '' }),
            { required: true, initial: [] }
          ),
          expertiseDice: new fields.NumberField({ required: true, initial: 0, integer: true }),
          minRoll: new fields.NumberField({
            required: true,
            initial: 1,
            integer: true,
            min: 1,
            max: 20
          }),
          bonuses: new fields.SchemaField({
            check: new fields.StringField({ required: true, initial: '' }),
            passive: new fields.NumberField({ required: true, initial: 0, integer: true })
          })
        }),
        per: new fields.SchemaField({
          ability: new fields.StringField({ required: true, initial: 'cha' }),
          value: new fields.NumberField({ required: true, initial: 0, integer: true }),
          proficient: new fields.BooleanField({ required: true, initial: false }),
          specialties: new fields.ArrayField(
            new fields.StringField({ required: true, initial: '' }),
            { required: true, initial: [] }
          ),
          expertiseDice: new fields.NumberField({ required: true, initial: 0, integer: true }),
          minRoll: new fields.NumberField({
            required: true,
            initial: 1,
            integer: true,
            min: 1,
            max: 20
          }),
          bonuses: new fields.SchemaField({
            check: new fields.StringField({ required: true, initial: '' }),
            passive: new fields.NumberField({ required: true, initial: 0, integer: true })
          })
        }),
        rel: new fields.SchemaField({
          ability: new fields.StringField({ required: true, initial: 'int' }),
          value: new fields.NumberField({ required: true, initial: 0, integer: true }),
          proficient: new fields.BooleanField({ required: true, initial: false }),
          specialties: new fields.ArrayField(
            new fields.StringField({ required: true, initial: '' }),
            { required: true, initial: [] }
          ),
          expertiseDice: new fields.NumberField({ required: true, initial: 0, integer: true }),
          minRoll: new fields.NumberField({
            required: true,
            initial: 1,
            integer: true,
            min: 1,
            max: 20
          }),
          bonuses: new fields.SchemaField({
            check: new fields.StringField({ required: true, initial: '' }),
            passive: new fields.NumberField({ required: true, initial: 0, integer: true })
          })
        }),
        slt: new fields.SchemaField({
          ability: new fields.StringField({ required: true, initial: 'dex' }),
          value: new fields.NumberField({ required: true, initial: 0, integer: true }),
          proficient: new fields.BooleanField({ required: true, initial: false }),
          specialties: new fields.ArrayField(
            new fields.StringField({ required: true, initial: '' }),
            { required: true, initial: [] }
          ),
          expertiseDice: new fields.NumberField({ required: true, initial: 0, integer: true }),
          minRoll: new fields.NumberField({
            required: true,
            initial: 1,
            integer: true,
            min: 1,
            max: 20
          }),
          bonuses: new fields.SchemaField({
            check: new fields.StringField({ required: true, initial: '' }),
            passive: new fields.NumberField({ required: true, initial: 0, integer: true })
          })
        }),
        ste: new fields.SchemaField({
          ability: new fields.StringField({ required: true, initial: 'dex' }),
          value: new fields.NumberField({ required: true, initial: 0, integer: true }),
          proficient: new fields.BooleanField({ required: true, initial: false }),
          specialties: new fields.ArrayField(
            new fields.StringField({ required: true, initial: '' }),
            { required: true, initial: [] }
          ),
          expertiseDice: new fields.NumberField({ required: true, initial: 0, integer: true }),
          minRoll: new fields.NumberField({
            required: true,
            initial: 1,
            integer: true,
            min: 1,
            max: 20
          }),
          bonuses: new fields.SchemaField({
            check: new fields.StringField({ required: true, initial: '' }),
            passive: new fields.NumberField({ required: true, initial: 0, integer: true })
          })
        }),
        sur: new fields.SchemaField({
          ability: new fields.StringField({ required: true, initial: 'wis' }),
          value: new fields.NumberField({ required: true, initial: 0, integer: true }),
          proficient: new fields.BooleanField({ required: true, initial: false }),
          specialties: new fields.ArrayField(
            new fields.StringField({ required: true, initial: '' }),
            { required: true, initial: [] }
          ),
          expertiseDice: new fields.NumberField({ required: true, initial: 0, integer: true }),
          minRoll: new fields.NumberField({
            required: true,
            initial: 1,
            integer: true,
            min: 1,
            max: 20
          }),
          bonuses: new fields.SchemaField({
            check: new fields.StringField({ required: true, initial: '' }),
            passive: new fields.NumberField({ required: true, initial: 0, integer: true })
          })
        })
      }),
      source: new fields.SchemaField({
        name: new fields.StringField({ required: true, initial: '' }),
        link: new fields.StringField({ required: true, initial: '' }),
        publisher: new fields.StringField({ required: true, initial: '' })
      }),
      traits: new fields.SchemaField({
        size: new fields.StringField({ required: true, initial: 'med' }),
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
      spellResources: new fields.SchemaField({
        slots: new fields.SchemaField({
          1: new fields.SchemaField({
            current: new fields.NumberField({ required: true, initial: 0, integer: true }),
            max: new fields.NumberField({ required: true, initial: 0, integer: true })
          }),
          2: new fields.SchemaField({
            current: new fields.NumberField({ required: true, initial: 0, integer: true }),
            max: new fields.NumberField({ required: true, initial: 0, integer: true })
          }),
          3: new fields.SchemaField({
            current: new fields.NumberField({ required: true, initial: 0, integer: true }),
            max: new fields.NumberField({ required: true, initial: 0, integer: true })
          }),
          4: new fields.SchemaField({
            current: new fields.NumberField({ required: true, initial: 0, integer: true }),
            max: new fields.NumberField({ required: true, initial: 0, integer: true })
          }),
          5: new fields.SchemaField({
            current: new fields.NumberField({ required: true, initial: 0, integer: true }),
            max: new fields.NumberField({ required: true, initial: 0, integer: true })
          }),
          6: new fields.SchemaField({
            current: new fields.NumberField({ required: true, initial: 0, integer: true }),
            max: new fields.NumberField({ required: true, initial: 0, integer: true })
          }),
          7: new fields.SchemaField({
            current: new fields.NumberField({ required: true, initial: 0, integer: true }),
            max: new fields.NumberField({ required: true, initial: 0, integer: true })
          }),
          8: new fields.SchemaField({
            current: new fields.NumberField({ required: true, initial: 0, integer: true }),
            max: new fields.NumberField({ required: true, initial: 0, integer: true })
          }),
          9: new fields.SchemaField({
            current: new fields.NumberField({ required: true, initial: 0, integer: true }),
            max: new fields.NumberField({ required: true, initial: 0, integer: true })
          })
        }),
        points: new fields.SchemaField({
          current: new fields.NumberField({ required: true, initial: 0, integer: true }),
          max: new fields.NumberField({ required: true, initial: 0, integer: true })
        })
      })
    });
  }
}
