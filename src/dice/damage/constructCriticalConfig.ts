import type { DamageRoll } from '../rolls/DamageRoll.ts';

const doubleAllDamage = {
	multiplier: 2,
	multiplyDiceTotal: true,
	multiplyNumeric: true,
} as DamageRoll.CritConfiguration;

const doubleDiceDamage = {
	multiplier: 2,
	multiplyDiceTotal: true,
} as DamageRoll.CritConfiguration;

const doubleDiceQuantity = {
	multiplier: 1,
	bonusDice: 1,
} as DamageRoll.CritConfiguration;

export function constructCriticalConfig() {
	// @ts-expect-error
	const mode = game.settings.get('a5e', 'critCalculationMode') as string;

	if (mode === 'doubleAllDamage') return doubleAllDamage;
	if (mode === 'doubleDiceDamage') return doubleDiceDamage;
	if (mode === 'doubleDiceQuantity') return doubleDiceQuantity;
}
