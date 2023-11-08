import A5E from '../../config';

export function getAbilitiesBonusContext() {
  const { fields } = foundry.data;
  return {
    abilities: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
      initial: Object.keys(A5E.abilities)
    }),
    types: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
      initial: ['check', 'save']
    }),
    requiresProficiency: new fields.BooleanField({ required: true, initial: false })
  };
}

export function getAttackBonusContext() {
  // const { fields } = foundry.data;
}

export function getDamageBonusContext() {
  const { fields } = foundry.data;
  return {
    attackTypes: new fields.ArrayField(
      new fields.StringField({ required: true, initial: '' }),
      { initial: Object.keys(A5E.damageBonusContexts) }
    ),
    damageTypes: new fields.ArrayField(
      new fields.StringField({ required: true, initial: '' }),
      { initial: [] }
    ),
    spellLevels: new fields.ArrayField(
      new fields.StringField({ required: true, initial: '' }),
      { initial: [] }
    )
  };
}

export function getHealingBonusContext() {
  const { fields } = foundry.data;
  return {
    healingTypes: new fields.ArrayField(
      new fields.StringField({ required: true, initial: '' }),
      { initial: ['healing'] }
    ),
    spellLevels: new fields.ArrayField(
      new fields.StringField({ required: true, initial: '' }),
      { initial: [] }
    )
  };
}

export function getSkillBonusContext() {
  const { fields } = foundry.data;
  return {
    requiresProficiency: new fields.BooleanField({ required: true, initial: false }),
    skills: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), { initial: [] })
  };
}
