import type { DamageRoll } from '../rolls/DamageRoll.ts';

const doubleAllDamage = {
	multiplier: 2,
	multiplyDice: true,
	multiplyNumeric: true,
} as DamageRoll.CritConfiguration;

const doubleDiceDamage = {} as DamageRoll.CritConfiguration;

export function constructCriticalConfig() {
	// @ts-expect-error
	const mode = game.settings.get('a5e', 'critCalculationMode') as string;

	if (mode === 'doubleAllDamage') return doubleAllDamage;
}
