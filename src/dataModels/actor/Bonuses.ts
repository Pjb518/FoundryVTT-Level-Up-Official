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
} from './Contexts.ts';

import fields = foundry.data.fields;

const baseBonusData = () => ({
	default: new fields.BooleanField({ required: true, nullable: false, initial: true }),
	formula: new fields.StringField({ required: true, nullable: false, initial: '' }),
	label: new fields.StringField({ required: true, nullable: false, initial: '' }),
	img: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'icons/svg/upgrade.svg',
	}),
});

export function getAbilitiesBonusData() {
	return {
		context: new fields.SchemaField(getAbilitiesBonusContext('bonus')),
		...baseBonusData(),
	};
}

export function getAttackBonusData() {
	return {
		context: new fields.SchemaField(getAttackBonusContext('bonus')),
		...baseBonusData(),
	};
}

export function getDamageBonusData() {
	return {
		context: new fields.SchemaField(getDamageBonusContext('bonus')),
		damageType: new fields.StringField({ required: true, initial: '' }),
		...baseBonusData(),
	};
}

export function getExertionBonusData() {
	return {
		...baseBonusData(),
	};
}

export function getHealingBonusData() {
	return {
		context: new fields.SchemaField(getHealingBonusContext('bonus')),
		healingType: new fields.StringField({ required: true, initial: 'healing' }),
		...baseBonusData(),
	};
}

export function getHitPointBonusData() {
	return {
		context: new fields.SchemaField(getHitPointsBonusContext('bonus')),
		...baseBonusData(),
	};
}

export function getInitiativeBonusData() {
	return {
		context: new fields.SchemaField(getInitiativeBonusContext('bonus')),
		...baseBonusData(),
	};
}

export function getMovementBonusData() {
	return {
		context: new fields.SchemaField(getMovementBonusContext('bonus')),
		unit: new fields.StringField({ required: true, initial: 'feet' }),
		...baseBonusData(),
	};
}

export function getSensesBonusData() {
	return {
		context: new fields.SchemaField(getSensesBonusContext('bonus')),
		unit: new fields.StringField({ required: true, initial: 'feet' }),
		...baseBonusData(),
	};
}

export function getSkillBonusData() {
	return {
		context: new fields.SchemaField(getSkillBonusContext('bonus')),
		...baseBonusData(),
	};
}
