import { writable } from 'svelte/store';

const MonsterFilterStore = writable({
	cr: {
		min: 0,
		max: 30,
	},
	creatureSize: {
		inclusive: [],
		inclusiveMode: 0,
		exclusive: [],
		exclusiveMode: 0,
	},
	creatureTypes: {
		inclusive: [],
		inclusiveMode: 0,
		exclusive: [],
		exclusiveMode: 0,
	},
	miscellaneous: {
		inclusive: [],
		inclusiveMode: 0,
		exclusive: [],
		exclusiveMode: 0,
	},
	terrain: {
		inclusive: [],
		inclusiveMode: 0,
		exclusive: [],
		exclusiveMode: 0,
	},
	source: {
		inclusive: [],
		inclusiveMode: 0,
		exclusive: [],
		exclusiveMode: 0,
	},
});

export default MonsterFilterStore;
