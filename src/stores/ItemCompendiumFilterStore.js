import { writable } from "svelte/store";

const MagicItemCompendiumStore = writable({
  objectType: {
    inclusive: [],
    inclusiveMode: 0,
    exclusive: [],
    exclusiveMode: 0
  },
  rarity: {
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
  }
});

export default MagicItemCompendiumStore;
