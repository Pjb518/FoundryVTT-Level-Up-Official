export function getAttackBonusContext() {

}

export function getDamageBonusContext() {
  const { fields } = foundry.data;
  return {
    attackType: new fields.ArrayField(
      new fields.StringField({ required: true, initial: '' }),
      { initial: ['all'] }
    ),
    spellLevel: new fields.ArrayField(
      new fields.StringField({ required: true, initial: '' }),
      { initial: [] }
    )
  };
}

export function getHealingBonusData() {
  const { fields } = foundry.data;
  return {
    healingType: new fields.ArrayField(
      new fields.StringField({ required: true, initial: '' }),
      { initial: ['healing'] }
    ),
    spellLevel: new fields.ArrayField(
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
