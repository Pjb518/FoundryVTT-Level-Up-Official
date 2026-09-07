import {
	abilitiesBonusContext,
	attackBonusContext,
	damageBonusContext,
	getMovementBonusContext,
	getSensesBonusContext,
	getSkillBonusContext,
	healingBonusContext,
	hitPointsBonusContext,
	initiativeBonusContext,
	movementBonusContext,
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
		context: new fields.SchemaField({ ...abilitiesBonusContext() }),
		...baseBonusData(),
	};
}

export function getAttackBonusData() {
	return {
		context: new fields.SchemaField(attackBonusContext()),
		...baseBonusData(),
	};
}

export function getDamageBonusData() {
	return {
		context: new fields.SchemaField(damageBonusContext()),
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
		context: new fields.SchemaField(healingBonusContext()),
		healingType: new fields.StringField({ required: true, initial: 'healing' }),
		...baseBonusData(),
	};
}

export function getHitPointBonusData() {
	return {
		context: new fields.SchemaField(hitPointsBonusContext()),
		...baseBonusData(),
	};
}

export function getInitiativeBonusData() {
	return {
		context: new fields.SchemaField(initiativeBonusContext()),
		...baseBonusData(),
	};
}

export function getMovementBonusData() {
	return {
		context: new fields.SchemaField(movementBonusContext()),
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
