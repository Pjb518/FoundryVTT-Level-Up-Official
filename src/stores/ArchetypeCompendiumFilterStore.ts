import { writable } from 'svelte/store';

const ArchetypeCompendiumStore = writable({
	class: {
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

export default ArchetypeCompendiumStore;
