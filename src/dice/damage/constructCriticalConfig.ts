import type { DamageRoll } from '../rolls/DamageRoll.ts';

const doubleAllDamage = {
	multiplier: 2,
	multiplyDiceTotal: true,
	multiplyNumeric: true,
} satisfies DamageRoll.CritConfiguration;

const doubleDiceDamage = {
	multiplier: 2,
	multiplyDiceTotal: true,
} satisfies DamageRoll.CritConfiguration;

const doubleDiceQuantity = {
	multiplier: 2,
	multiplyDice: true,
} satisfies DamageRoll.CritConfiguration;

const doubleDiceQuantityAndMods = {
	multiplier: 2,
	multiplyDice: true,
	multiplyNumeric: true,
} satisfies DamageRoll.CritConfiguration;

const maxDamage = {
	maximizeDice: true,
} satisfies DamageRoll.CritConfiguration;

const maxDamagePlusRoll = {
	powerfulCritical: true,
} satisfies DamageRoll.CritConfiguration;

// const doubleDiceQuantityAndMods = {
// } as DamageRoll.CritConfiguration;

export function constructCriticalConfig(): DamageRoll.CritConfiguration {
	// @ts-expect-error
	const mode = game.settings.get('a5e', 'critCalculationMode') as string;

	if (mode === 'doubleAllDamage') return doubleAllDamage;
	if (mode === 'doubleDiceDamage') return doubleDiceDamage;
	if (mode === 'doubleDiceQuantity') return doubleDiceQuantity;
	if (mode === 'doubleDiceQuantityAndMods') return doubleDiceQuantityAndMods;
	if (mode === 'maxDamage') return maxDamage;
	if (mode === 'maxDamagePlusRoll') return maxDamagePlusRoll;
	return {} as DamageRoll.CritConfiguration;
}
