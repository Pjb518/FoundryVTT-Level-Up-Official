import { MigrationBase } from '../MigrationBase.ts';

export class Migration023MigrateRoll extends MigrationBase {
	static override version = 0.023;

	/** ================================================= */
	// Keys
	/** ================================================= */

	KEY_MAP = {
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
		...Object.keys(CONFIG.A5E.abilities).reduce(
			(acc, a) => {
				acc[`flags.a5e.effects.rollMode.abilityCheck.${a}`] =
					`system.abilities.${a}.check.rollMode`;
				acc[`flags.a5e.effects.rollMode.abilitySave.${a}`] = `system.abilities.${a}.save.rollMode`;
				return acc;
			},
			{} as Record<string, string>,
		),

		// Skills
		...Object.keys(CONFIG.A5E.skills).reduce(
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

	KEY_MAP_KEYS = new Set(Object.keys(this.KEY_MAP));

	ITEM_TYPES = new Set(['base', 'feature', 'interaction', 'maneuver', 'object', 'spell']);

	/** ================================================= */
	// Migration Methods
	/** ================================================= */

	override async updateItem(source: Item): Promise<void> {
		if (!this.ITEM_TYPES.has(source.type)) return;

		// Update scaling values
		const actions = Object.entries(source.system.actions ?? {});
		actions.forEach(([actionId, action]) => {
			// Update target scaling
			const targetScaleValue = (action.target.scaling.formula as string) || '';
			if (targetScaleValue) {
				source.system.actions![actionId].target.scaling.config.value = targetScaleValue;
			}

			// Update rolls
			const rolls = Object.entries(action.rolls ?? {});
			rolls.forEach(([rollId, roll]) => {
				if (roll.type === 'healing' || roll.type === 'damage' || roll.type === 'generic') {
					const rollScaleValue = (roll.scaling.formula as string) || '';
					if (rollScaleValue) {
						foundry.utils.setProperty(
							source.system,
							`actions.${actionId}.rolls.${rollId}.scaling.config.value`,
							rollScaleValue,
						);
					}
				}
			});
		});
	}

	override async updateEffect(source: ActiveEffect): Promise<void> {
		source.system.changes.forEach((change, idx) => {
			// Update roll mode keys
			if (this.KEY_MAP_KEYS.has(change.key)) {
				source.system.changes[idx].key = this.KEY_MAP[change.key] || change.key;
			}
		});
	}
}
