import { A5EBaseActiveEffectData } from './base';

const activeEffectModels = {
	base: A5EBaseActiveEffectData,
};

export default activeEffectModels;

declare global {
	interface DataModelConfig {
		ActiveEffect: {
			base: A5EBaseActiveEffectData;
		};
	}
}
