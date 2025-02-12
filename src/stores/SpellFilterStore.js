import { writable } from 'svelte/store';

const SpellFilterStore = writable({
	spellLists: {
		inclusive: [],
		inclusiveMode: 0,
		exclusive: [],
		exclusiveMode: 1,
	},
	spellLevels: {
		inclusive: [],
		inclusiveMode: 0,
		exclusive: [],
		exclusiveMode: 0,
	},
	components: {
		inclusive: [],
		inclusiveMode: 0,
		exclusive: [],
		exclusiveMode: 1,
	},
	miscellaneous: {
		inclusive: [],
		inclusiveMode: 0,
		exclusive: [],
		exclusiveMode: 0,
	},
	primarySpellSchools: {
		inclusive: [],
		inclusiveMode: 0,
		exclusive: [],
		exclusiveMode: 0,
	},
	secondarySpellSchools: {
		inclusive: [],
		inclusiveMode: 1,
		exclusive: [],
		exclusiveMode: 1,
	},
	source: {
		inclusive: [],
		inclusiveMode: 0,
		exclusive: [],
		exclusiveMode: 0,
	},
});

export default SpellFilterStore;
