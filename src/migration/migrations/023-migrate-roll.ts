import { A5E } from '../../config.ts';
import { MigrationBase } from '../MigrationBase.ts';

const KEY_MAP = {
	// Attacks
	'flags.a5e.effects.rollMode.attack.meleeWeaponAttack':
		'system.rolls.attack.outgoing.meleeWeaponAttack.rollMode',

	'flags.a5e.effects.rollMode.attack.rangedWeaponAttack':
		'system.rolls.attack.outgoing.rangedWeaponAttack.rollMode',

	'flags.a5e.effects.rollMode.attack.meleeSpellAttack':
		'system.rolls.attack.outgoing.meleeSpellAttack.rollMode',

	'flags.a5e.effects.rollMode.attack.rangedSpellAttack':
		'system.rolls.attack.outgoing.rangedSpellAttack.rollMode',

	// Abilities
	...Object.keys(A5E.abilities).reduce(
		(acc, a) => {
			acc[`flags.a5e.effects.rollMode.abilityCheck.${a}`] = `system.abilities.${a}.check.rollMode`;
			acc[`flags.a5e.effects.rollMode.abilitySave.${a}`] = `system.abilities.${a}.save.rollMode`;
			return acc;
		},
		{} as Record<string, string>,
	),

	// Skills
	...Object.keys(A5E.skills).reduce(
		(acc, s) => {
			acc[`flags.a5e.effects.rollMode.skillCheck.${s}`] = `system.skills.${s}.check.rollMode`;
			return acc;
		},
		{} as Record<string, string>,
	),

	// Other
	'flags.a5e.effects.rollMode.concentration': 'system.attributes.concentration.roll.rollMode',
	'flags.a5e.effects.rollMode.deathSave': 'system.rolls.death.rollMode',
	'flags.a5e.effects.rollMode.initiative': 'system.attributes.initiative.rollMode',
};

const KEY_MAP_KEYS = new Set(Object.keys(KEY_MAP));

export class Migration23MigrateRoll extends MigrationBase {
	static override version = 0.023;

	override async updateEffect(source: ActiveEffect, parent?: any): Promise<void> {
		source.system.changes.forEach((change, idx) => {
			// Update roll mode keys
			if (KEY_MAP_KEYS.has(change.key)) {
				source.system.changes[idx].key = KEY_MAP_KEYS[change.key] || change.key;
			}
		});
	}
}
