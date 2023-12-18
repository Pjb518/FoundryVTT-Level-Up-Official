import {
  getAbilitiesBonusContext, getDamageBonusContext, getHealingBonusContext, getSkillBonusContext
} from './Contexts';

export function getAbilitiesBonusData() {
  const { fields } = foundry.data;
  return {
    context: new fields.SchemaField(getAbilitiesBonusContext()),
    default: new fields.BooleanField({ required: true, initial: true }),
    formula: new fields.StringField({ required: true, initial: '' }),
    label: new fields.StringField({ required: true, initial: '' }),
    img: new fields.StringField({ required: true, initial: 'icons/svg/upgrade.svg' })
  };
}

export function getDamageBonusData() {
  const { fields } = foundry.data;
  return {
    context: new fields.SchemaField(getDamageBonusContext()),
    damageType: new fields.StringField({ required: true, initial: '' }),
    default: new fields.BooleanField({ required: true, initial: true }),
    formula: new fields.StringField({ required: true, initial: '' }),
    label: new fields.StringField({ required: true, initial: '' }),
    img: new fields.StringField({ required: true, initial: 'icons/svg/upgrade.svg' })
  };
}

export function getHealingBonusData() {
  const { fields } = foundry.data;
  return {
    context: new fields.SchemaField(getHealingBonusContext()),
    default: new fields.BooleanField({ required: true, initial: true }),
    healingType: new fields.StringField({ required: true, initial: 'healing' }),
    formula: new fields.StringField({ required: true, initial: '' }),
    label: new fields.StringField({ required: true, initial: '' }),
    img: new fields.StringField({ required: true, initial: 'icons/svg/upgrade.svg' })
  };
}

export function getSkillBonusData() {
  const { fields } = foundry.data;
  return {
    context: new fields.SchemaField(getSkillBonusContext()),
    default: new fields.BooleanField({ required: true, initial: true }),
    formula: new fields.StringField({ required: true, initial: '' }),
    label: new fields.StringField({ required: true, initial: '' }),
    img: new fields.StringField({ required: true, initial: 'icons/svg/upgrade.svg' })
  };
}
