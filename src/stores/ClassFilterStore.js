import { writable } from 'svelte/store';

const ClassFeatureFilterStore = writable({
  classes: {
    inclusive: [],
    inclusiveMode: 0,
    exclusive: [],
    exclusiveMode: 0
  },
  featureType: {
    inclusive: [],
    inclusiveMode: 0,
    exclusive: [],
    exclusiveMode: 0
  },
  source: {
    inclusive: [],
    inclusiveMode: 0,
    exclusive: [],
    exclusiveMode: 0
  }
});

export default ClassFeatureFilterStore;
