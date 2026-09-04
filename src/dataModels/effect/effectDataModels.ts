import { A5EBaseActiveEffectData } from './base.ts';

const activeEffectModels = {
	base: A5EBaseActiveEffectData,
};

export default activeEffectModels;

declare module 'fvtt-types/configuration' {
	interface DataModelConfig {
		ActiveEffect: {
			base: typeof A5EBaseActiveEffectData;
		};
	}
}
