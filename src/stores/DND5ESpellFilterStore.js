import { writable } from "svelte/store";

const DND5ESpellFilterStore = writable({
  spellLevels: {
    inclusive: [],
    inclusiveMode: 0,
    exclusive: [],
    exclusiveMode: 0
  },
  miscellaneous: {
    inclusive: [],
    inclusiveMode: 0,
    exclusive: [],
    exclusiveMode: 0
  },
  primarySpellSchools: {
    inclusive: [],
    inclusiveMode: 0,
    exclusive: [],
    exclusiveMode: 0
  }
});

export default DND5ESpellFilterStore;
