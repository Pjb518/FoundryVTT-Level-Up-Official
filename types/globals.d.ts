import type { A5E } from '../src/config.ts';
import type { BaseRoll } from '../src/dice/rolls/BaseRoll.ts';
import type { D20Roll } from '../src/dice/rolls/D20Roll.ts';
import type { DamageRoll } from '../src/dice/rolls/DamageRoll.ts';
import type { BaseDie } from '../src/dice/terms/BaseDie.ts';
import type { D20Die } from '../src/dice/terms/D20Die.ts';
import type { ExpertiseDie } from '../src/dice/terms/ExpertiseDie.ts';

import type A5eGame from '../src/interfaces/A5eGame.interface';

declare global {
	/** Alias for foundry.data.fields.DataSchema used in TypeDataModel schema declarations */
	type DataSchema = foundry.data.fields.DataSchema;

	type Creature = Actor.OfType<'character'> | Actor.OfType<'npc'>;
}

declare module 'fvtt-types/configuration' {
	interface SystemNameConfig {
		name: 'a5e';
	}

	interface SystemConfig {
		Item: {
			discriminate: all;
		};
		Actor: {
			discriminate: all;
		};
	}

	interface AssumeHookRan {
		ready: true;
	}

	interface ReadyGame {
		a5e: A5eGame;
	}

	interface CONFIG {
		A5E: typeof A5E;
		ActiveEffect: {
			changeTypes: {
				custom: 0;
				multiply: 10;
				add: 20;
				subtract: 20;
				downgrade: 30;
				upgrade: 40;
				override: 50;
				conditional: 60;
			};
		};
		Dice: CONFIG.Dice & {
			BaseRoll: typeof BaseRoll;
			BaseDie: typeof BaseDie;
			D20Die: typeof D20Die;
			D20Roll: typeof D20Roll;
			DamageRoll: typeof DamageRoll;
			terms: { d: typeof BaseDie };
			termTypes: {
				ExpertiseDie: typeof ExpertiseDie;
			};
		};
	}

	interface FlagConfig {
		Actor: {
			a5e: {
				automaticallyExecuteAvailableMacros: boolean;
				automateClasses: boolean;
				automateHitDice: boolean;
				automateHitPoints: boolean;
				automateSpellResources: boolean;
				automatePrototypeTokenSize: boolean;
				carryCapacityAbility: string;
				criticalHitThresholdWeapon: number;
				criticalHitThresholdSpell: number;
				deathSaveThreshold: number;
				halflingLuck: boolean;
				jackOfAllTrades: boolean;
			};
		};
	}

	namespace Hooks {
		interface HookConfig {}
	}

	interface SettingConfig {
		'a5e.5eStyleDeathSaves': boolean;
		'a5e.automateBloodiedApplication': boolean;
		'a5e.automatePrototypeTokenSize': boolean;
		'a5e.automateUnconsciousApplication': boolean;
		'a5e.automateVisionRules': boolean;
		'a5e.blindDeathSaves': boolean;
		'a5e.cascadingDamageAndHealingDelay': number;
		'a5e.consumeSupplyByDefault': boolean;
		'a5e.enableCascadingDamageAndHealing': boolean;
		'a5e.hideExpertiseDice': boolean;
		'a5e.replaceFatigueAndStrife': boolean;
		'a5e.showFavorPoints': boolean;
		'a5e.showVRCImplants': boolean;
		'a5e.useCredits': boolean;
		'a5e.a5e.visionRulesApplyToCharactersOnly': boolean;
	}
}

/**
 * Custom defs
 */

declare global {}

export default (something = {});
