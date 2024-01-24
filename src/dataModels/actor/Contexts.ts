export function getAbilitiesBonusContext(type: 'grant' | 'bonus') {
  const { fields } = foundry.data;

  const schema: any = {
    types: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
      initial: ['check', 'save']
    }),
    requiresProficiency: new fields.BooleanField({ required: true, initial: false })
  };

  if (type === 'bonus') {
    schema.abilities = new fields.ArrayField(
      new fields.StringField({ required: true, initial: '' }),
      { initial: [] }
    );
  }

  return schema;
}

export function getAttackBonusContext() {
  const { fields } = foundry.data;
  return {
    attackTypes: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
      initial: Object.keys(CONFIG.A5E.attackTypes)
    }),
    spellLevels: new fields.ArrayField(
      new fields.StringField({ required: true, initial: '' }),
      { initial: [] }
    ),
    requiresProficiency: new fields.BooleanField({ required: true, initial: false })
  };
}

export function getDamageBonusContext() {
  const { fields } = foundry.data;
  return {
    attackTypes: new fields.ArrayField(
      new fields.StringField({ required: true, initial: '' }),
      { initial: [] }
    ),
    damageTypes: new fields.ArrayField(
      new fields.StringField({ required: true, initial: '' }),
      { initial: [] }
    ),
    isCritBonus: new fields.BooleanField({ required: true, initial: false }),
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

export function getInitiativeBonusContext() {
  const { fields } = foundry.data;
  return {
    abilities: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
      initial: Object.keys(CONFIG.A5E.abilities)
    }),
    skills: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
      initial: Object.keys(CONFIG.A5E.skills)
    })
  };
}

export function getSkillBonusContext(type: 'grant' | 'bonus') {
  const { fields } = foundry.data;

  const schema: any = {
    passiveOnly: new fields.BooleanField({ required: true, initial: false }),
    requiresProficiency: new fields.BooleanField({ required: true, initial: false })
  };

  if (type === 'bonus') {
    schema.skills = new fields.ArrayField(
      new fields.StringField({ required: true, initial: '' }),
      { initial: [] }
    );
  }

  return schema;
}
