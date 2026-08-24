import type { A5E } from '../src/config.ts';

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
	}

	interface DataModelConfig {
		ActiveEffect: {};
		Actor: {};
		Item: {};
	}

	interface FlagConfig {
		Actor: {};
	}

	namespace Hooks {
		interface HookConfig {}
	}

	interface SettingsConfig {}
}

export default (something = {});
