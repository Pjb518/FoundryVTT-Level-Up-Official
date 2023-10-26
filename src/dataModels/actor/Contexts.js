export function getAttackBonusContext() {

}

export function getDamageBonusContext() {
  const { fields } = foundry.data;
  return {
    attackTypes: new fields.ArrayField(
      new fields.StringField({ required: true, initial: '' }),
      { initial: ['all'] }
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

export function getHealingBonusData() {
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

export function getSkillContextData() {
  const { fields } = foundry.data;
  return {
    ability: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), { initial: [] }),
    skills: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), { initial: [] })
  };
}
