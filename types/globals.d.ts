import type { A5E } from '../src/config.ts';
import type { BaseRoll } from '../src/dice/rolls/BaseRoll.ts';
import type { D20Roll } from '../src/dice/rolls/D20Roll.ts';
import type { BaseDie } from '../src/dice/terms/BaseDie.ts';
import type { D20Die } from '../src/dice/terms/D20Die.ts';

import type A5eGame from '../src/interfaces/A5eGame.interface';

declare global {
	/** Alias for foundry.data.fields.DataSchema used in TypeDataModel schema declarations */
	type DataSchema = foundry.data.fields.DataSchema;
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
		Dice: CONFIG.Dice & {
			BaseRoll: typeof BaseRoll;
			D20Roll: typeof D20Roll;
			BaseDie: typeof BaseDie;
			D20Die: typeof D20Die;
			terms: { d: typeof BaseDie };
		};
	}

	interface FlagConfig {
		Actor: {
			a5e: {
				automaticallyExecuteAvailableMacros: boolean;
			};
		};
	}

	namespace Hooks {
		interface HookConfig {}
	}

	interface SettingsConfig {}
}

/**
 * Custom defs
 */

declare global {}

export default (something = {});
