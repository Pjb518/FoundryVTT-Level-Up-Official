import RecordField from '../fields/RecordField';
import UnchasteSchemaField from '../fields/UnchasteSchemaField';

import {
  getAbilitiesBonusData,
  getAttackBonusData,
  getDamageBonusData,
  getExertionBonusData,
  getHealingBonusData,
  getHitPointBonusData,
  getInitiativeBonusData,
  getMovementBonusData,
  getSensesBonusData,
  getSkillBonusData
} from './Bonuses';

const { fields } = foundry.data;

export const abilities = () => ({
  abilities: new fields.SchemaField(
    Object.keys(CONFIG.A5E.abilities ?? {}).reduce((acc, abl) => {
      acc[abl] = new fields.SchemaField({
        value: new fields.NumberField({ required: true, initial: 10, integer: true }),
        check: new fields.SchemaField({
          expertiseDice: new fields.NumberField({
            required: true, initial: 0, integer: true
          }),
          bonus: new fields.StringField({ required: true, initial: '' })
        }),
        save: new fields.SchemaField({
          proficient: new fields.BooleanField({ required: true, initial: false }),
          expertiseDice: new fields.NumberField({
            required: true, initial: 0, integer: true
          }),
          bonus: new fields.StringField({ required: true, initial: '' }),
          ...(abl === 'con' ? { concentrationBonus: new fields.StringField({ required: true, initial: '' }) } : {})
        })
      });

      return acc;
    }, {})
  )
});

export const attributes = () => ({
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
  initiative: new fields.SchemaField({
    ability: new fields.StringField({ required: true, initial: 'dex' }),
    // TODO: Migration Upgrade - Remove this at a later date when migration is guaranteed
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
});

export const hitDice = () => (
  new fields.SchemaField({
    current: new fields.NumberField({
      required: true, initial: 0, integer: true, min: 0
    }),
    total: new fields.NumberField({
      required: true, initial: 0, integer: true, min: 0
    })
  })
);

export const bonuses = () => ({
  bonuses: new fields.SchemaField({
    abilities: new RecordField(
      new fields.DocumentIdField({ required: true, initial: () => foundry.utils.randomID() }),
      // @ts-expect-error
      new UnchasteSchemaField(getAbilitiesBonusData())
    ),
    attacks: new RecordField(
      new fields.DocumentIdField({ required: true, initial: () => foundry.utils.randomID() }),
      new fields.SchemaField(getAttackBonusData())
    ),
    damage: new RecordField(
      new fields.DocumentIdField({ required: true, initial: () => foundry.utils.randomID() }),
      new fields.SchemaField(getDamageBonusData())
    ),
    exertion: new RecordField(
      new fields.DocumentIdField({ required: true, initial: () => foundry.utils.randomID() }),
      new fields.SchemaField(getExertionBonusData())
    ),
    healing: new RecordField(
      new fields.DocumentIdField({ required: true, initial: () => foundry.utils.randomID() }),
      new fields.SchemaField(getHealingBonusData())
    ),
    hitPoint: new RecordField(
      new fields.DocumentIdField({ required: true, initial: () => foundry.utils.randomID() }),
      new fields.SchemaField(getHitPointBonusData())
    ),
    initiative: new RecordField(
      new fields.DocumentIdField({ required: true, initial: () => foundry.utils.randomID() }),
      new fields.SchemaField(getInitiativeBonusData())
    ),
    movement: new RecordField(
      new fields.DocumentIdField({ required: true, initial: () => foundry.utils.randomID() }),
      new fields.SchemaField(getMovementBonusData())
    ),
    senses: new RecordField(
      new fields.DocumentIdField({ required: true, initial: () => foundry.utils.randomID() }),
      new fields.SchemaField(getSensesBonusData())
    ),
    skills: new RecordField(
      new fields.DocumentIdField({ required: true, initial: () => foundry.utils.randomID() }),
      new fields.SchemaField(getSkillBonusData())
    ),
    maneuverDC: new fields.StringField({ initial: '' }),
    spellDC: new fields.StringField({ initial: '' }),
    // TODO: Migration Upgrade - Remove these at a later date when migration is guaranteed
    meleeSpellAttack: new fields.StringField({ initial: '' }),
    meleeWeaponAttack: new fields.StringField({ initial: '' }),
    rangedSpellAttack: new fields.StringField({ initial: '' }),
    rangedWeaponAttack: new fields.StringField({ initial: '' })
  })
});

export const currency = () => ({
  currency: new fields.SchemaField({
    cp: new fields.NumberField({ required: true, initial: 0, integer: true }),
    sp: new fields.NumberField({ required: true, initial: 0, integer: true }),
    ep: new fields.NumberField({ required: true, initial: 0, integer: true }),
    gp: new fields.NumberField({ required: true, initial: 0, integer: true }),
    pp: new fields.NumberField({ required: true, initial: 0, integer: true })
  })
});

export const details = () => ({
  bio: new fields.StringField({ required: true, initial: '' }),
  creatureTypes: new fields.ArrayField(
    new fields.StringField({ required: true, initial: '' }),
    { required: true, initial: [] }
  )
});

export const grants = () => ({
  grants: new RecordField(
    new fields.DocumentIdField({ required: true, initial: () => foundry.utils.randomID() }),
    new fields.ObjectField()
  )
});

export const proficiencies = () => ({
  proficiencies: new fields.SchemaField({
    armor: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), { required: true, initial: [] }),
    languages: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), { required: true, initial: [] }),
    tools: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), { required: true, initial: [] }),
    weapons: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), { required: true, initial: [] })
  })
});

export const resources = () => ({
  ...['primary', 'secondary', 'tertiary', 'quaternary'].reduce((acc, res) => {
    acc[res] = new fields.SchemaField({
      label: new fields.StringField({ required: true, initial: '' }),
      value: new fields.NumberField({ required: true, initial: 0, integer: true }),
      max: new fields.StringField({ required: true, initial: '' }),
      per: new fields.StringField({ required: true, initial: '' }),
      hideMax: new fields.BooleanField({ required: true, initial: false }),
      recharge: new fields.SchemaField({
        formula: new fields.StringField({ required: true, initial: '1d6' }),
        threshold: new fields.NumberField({ required: true, initial: 6, integer: true })
      })
    });

    return acc;
  }, {})
});

export const skills = () => ({
  skills: new fields.SchemaField(
    Object.keys(CONFIG.A5E.skills ?? {}).reduce((acc, skill) => {
      acc[skill] = new fields.SchemaField({
        ability: new fields.StringField({
          required: true, initial: CONFIG.A5E.skillDefaultAbilities[skill] ?? 'int'
        }),
        proficient: new fields.NumberField({
          required: true, initial: 0, integer: true, min: 0, max: 2
        }),
        specialties: new fields.ArrayField(
          new fields.StringField({ required: true, initial: '' }),
          { required: true, initial: [] }
        ),
        expertiseDice: new fields.NumberField({ required: true, initial: 0, integer: true }),
        minRoll: new fields.NumberField({
          required: true, initial: 1, integer: true, min: 1, max: 20
        }),
        bonuses: new fields.SchemaField({
          check: new fields.StringField({ required: true, initial: '' }),
          passive: new fields.NumberField({ required: true, initial: 0, integer: true })
        })
      });

      return acc;
    }, {})
  )
});

export const spellBooks = () => ({
  spellBooks: new RecordField(
    new fields.DocumentIdField({ required: true, initial: () => foundry.utils.randomID() }),
    new fields.ObjectField(),
    {
      required: true,
      initial: () => ({ [foundry.utils.randomID()]: {} })
    }
  )
});

export const traits = () => ({
  traits: new fields.SchemaField({
    size: new fields.StringField({ required: true, initial: 'med' }),
    alignment: new fields.ArrayField(
      new fields.StringField({ required: true, initial: '' }),
      { required: true, initial: [] }
    ),
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
  })
});
