export function getAbilitiesBonusContext(type: 'grant' | 'bonus') {
  const { fields } = foundry.data;

  const schema: Record<string, any> = {
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

  if (type === 'grant') {
    schema.default = new fields.BooleanField({ required: true, initial: true });
  }

  return schema;
}

export function getAttackBonusContext(type: 'grant' | 'bonus') {
  const { fields } = foundry.data;

  const schema: Record<string, any> = {
    spellLevels: new fields.ArrayField(
      new fields.StringField({ required: true, initial: '' }),
      { initial: [] }
    ),
    requiresProficiency: new fields.BooleanField({ required: true, initial: false })
  };

  if (type === 'bonus') {
    schema.attackTypes = new fields.ArrayField(
      new fields.StringField({ required: true, initial: '' }),
      { initial: [] }
    );
  }

  if (type === 'grant') {
    schema.default = new fields.BooleanField({ required: true, initial: true });
  }

  return schema;
}

export function getDamageBonusContext(type: 'grant' | 'bonus') {
  const { fields } = foundry.data;

  const schema: Record<string, any> = {
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

  if (type === 'grant') {
    schema.default = new fields.BooleanField({ required: true, initial: true });
  }

  return schema;
}

export function getHealingBonusContext(type: 'grant' | 'bonus') {
  const { fields } = foundry.data;
  const schema: Record<string, any> = {
    healingTypes: new fields.ArrayField(
      new fields.StringField({ required: true, initial: '' }),
      { initial: ['healing'] }
    ),
    spellLevels: new fields.ArrayField(
      new fields.StringField({ required: true, initial: '' }),
      { initial: [] }
    )
  };

  if (type === 'grant') {
    schema.default = new fields.BooleanField({ required: true, initial: true });
  }

  return schema;
}

export function getInitiativeBonusContext(type: 'grant' | 'bonus') {
  const { fields } = foundry.data;

  const schema: Record<string, any> = {
    abilities: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
      initial: Object.keys(CONFIG.A5E.abilities)
    }),
    skills: new fields.ArrayField(new fields.StringField({ required: true, initial: '' }), {
      initial: Object.keys(CONFIG.A5E.skills)
    })
  };

  if (type === 'grant') {
    schema.default = new fields.BooleanField({ required: true, initial: true });
  }

  return schema;
}

export function getMovementBonusContext(type: 'grant' | 'bonus') {
  const { fields } = foundry.data;

  const schema: any = {
    isHover: new fields.BooleanField({ required: true, initial: false })
    // valueIfOriginalIsZero: new fields.StringField({ required: true, initial: '' })
  };

  if (type === 'bonus') {
    schema.movementTypes = new fields.ArrayField(
      new fields.StringField({ required: true, initial: '' }),
      { initial: [] }
    );
  }

  return schema;
}

export function getSensesBonusContext(type: 'grant' | 'bonus') {
  const { fields } = foundry.data;

  const schema: any = {
    otherwiseBlind: new fields.BooleanField({ required: true, initial: false })
    // valueIfOriginalIsZero: new fields.StringField({ required: true, initial: '' })
  };

  if (type === 'bonus') {
    schema.senses = new fields.ArrayField(
      new fields.StringField({ required: true, initial: '' }),
      { initial: [] }
    );
  }

  return schema;
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

  if (type === 'grant') {
    schema.default = new fields.BooleanField({ required: true, initial: true });
  }

  return schema;
}
