import { writable } from 'svelte/store';

const ManeuverFilterStore = writable({
  exertion: {
    min: 0,
    max: 3
  },
  maneuverDegrees: {
    inclusive: [],
    inclusiveMode: 0,
    exclusive: [],
    exclusiveMode: 0
  },
  maneuverTraditions: {
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

export default ManeuverFilterStore;
