import {
	getAbilitiesBonusContext,
	getAttackBonusContext,
	getDamageBonusContext,
	getHealingBonusContext,
	getHitPointsBonusContext,
	getInitiativeBonusContext,
	getMovementBonusContext,
	getSensesBonusContext,
	getSkillBonusContext,
} from './Contexts';

export function getAbilitiesBonusData() {
	const { fields } = foundry.data;
	return {
		context: new fields.SchemaField(getAbilitiesBonusContext('bonus')),
		default: new fields.BooleanField({ required: true, initial: true }),
		formula: new fields.StringField({ required: true, initial: '' }),
		label: new fields.StringField({ required: true, initial: '' }),
		img: new fields.StringField({ required: true, initial: 'icons/svg/upgrade.svg' }),
	};
}

export function getAttackBonusData() {
	const { fields } = foundry.data;
	return {
		context: new fields.SchemaField(getAttackBonusContext('bonus')),
		default: new fields.BooleanField({ required: true, initial: true }),
		formula: new fields.StringField({ required: true, initial: '' }),
		label: new fields.StringField({ required: true, initial: '' }),
		img: new fields.StringField({ required: true, initial: 'icons/svg/upgrade.svg' }),
	};
}

export function getDamageBonusData() {
	const { fields } = foundry.data;
	return {
		context: new fields.SchemaField(getDamageBonusContext('bonus')),
		damageType: new fields.StringField({ required: true, initial: '' }),
		default: new fields.BooleanField({ required: true, initial: true }),
		formula: new fields.StringField({ required: true, initial: '' }),
		label: new fields.StringField({ required: true, initial: '' }),
		img: new fields.StringField({ required: true, initial: 'icons/svg/upgrade.svg' }),
	};
}

export function getExertionBonusData() {
	const { fields } = foundry.data;
	return {
		formula: new fields.StringField({ required: true, initial: '' }),
		label: new fields.StringField({ required: true, initial: '' }),
		img: new fields.StringField({ required: true, initial: 'icons/svg/upgrade.svg' }),
	};
}

export function getHealingBonusData() {
	const { fields } = foundry.data;
	return {
		context: new fields.SchemaField(getHealingBonusContext('bonus')),
		default: new fields.BooleanField({ required: true, initial: true }),
		healingType: new fields.StringField({ required: true, initial: 'healing' }),
		formula: new fields.StringField({ required: true, initial: '' }),
		label: new fields.StringField({ required: true, initial: '' }),
		img: new fields.StringField({ required: true, initial: 'icons/svg/upgrade.svg' }),
	};
}

export function getHitPointBonusData() {
	const { fields } = foundry.data;
	return {
		context: new fields.SchemaField(getHitPointsBonusContext('bonus')),
		default: new fields.BooleanField({ required: true, initial: true }),
		formula: new fields.StringField({ required: true, initial: '' }),
		label: new fields.StringField({ required: true, initial: '' }),
		img: new fields.StringField({ required: true, initial: 'icons/svg/upgrade.svg' }),
	};
}

export function getInitiativeBonusData() {
	const { fields } = foundry.data;
	return {
		context: new fields.SchemaField(getInitiativeBonusContext('bonus')),
		default: new fields.BooleanField({ required: true, initial: true }),
		formula: new fields.StringField({ required: true, initial: '' }),
		label: new fields.StringField({ required: true, initial: '' }),
		img: new fields.StringField({ required: true, initial: 'icons/svg/upgrade.svg' }),
	};
}

export function getMovementBonusData() {
	const { fields } = foundry.data;
	return {
		context: new fields.SchemaField(getMovementBonusContext('bonus')),
		unit: new fields.StringField({ required: true, initial: 'feet' }),
		formula: new fields.StringField({ required: true, initial: '' }),
		label: new fields.StringField({ required: true, initial: '' }),
		img: new fields.StringField({ required: true, initial: 'icons/svg/upgrade.svg' }),
	};
}

export function getSensesBonusData() {
	const { fields } = foundry.data;
	return {
		context: new fields.SchemaField(getSensesBonusContext('bonus')),
		unit: new fields.StringField({ required: true, initial: 'feet' }),
		formula: new fields.StringField({ required: true, initial: '' }),
		label: new fields.StringField({ required: true, initial: '' }),
		img: new fields.StringField({ required: true, initial: 'icons/svg/upgrade.svg' }),
	};
}

export function getSkillBonusData() {
	const { fields } = foundry.data;
	return {
		context: new fields.SchemaField(getSkillBonusContext('bonus')),
		default: new fields.BooleanField({ required: true, initial: true }),
		formula: new fields.StringField({ required: true, initial: '' }),
		label: new fields.StringField({ required: true, initial: '' }),
		img: new fields.StringField({ required: true, initial: 'icons/svg/upgrade.svg' }),
	};
}
