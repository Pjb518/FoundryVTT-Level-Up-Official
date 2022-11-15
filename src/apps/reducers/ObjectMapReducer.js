/* eslint-disable max-classes-per-file */
import {
  DynMapReducer,
  DerivedMapReducer
} from '@typhonjs-fvtt/runtime/svelte/store';

class AmmunitionMapReducer extends DerivedMapReducer {
  initialize() {
    this.filters.add(
      (item) => item.type === 'object' && item.system.objectType === 'ammunition'
    );
    this.sort.set((a, b) => a.sort - b.sort);
  }
}
class ArmorMapReducer extends DerivedMapReducer {
  initialize() {
    this.filters.add(
      (item) => item.type === 'object' && item.system.objectType === 'armor'
    );
    this.sort.set((a, b) => a.sort - b.sort);
  }
}
class ClothingMapReducer extends DerivedMapReducer {
  initialize() {
    this.filters.add(
      (item) => item.type === 'object' && item.system.objectType === 'clothing'
    );
    this.sort.set((a, b) => a.sort - b.sort);
  }
}
class ConsumableMapReducer extends DerivedMapReducer {
  initialize() {
    this.filters.add(
      (item) => item.type === 'object' && item.system.objectType === 'consumable'
    );
    this.sort.set((a, b) => a.sort - b.sort);
  }
}
class ContainerMapReducer extends DerivedMapReducer {
  initialize() {
    this.filters.add(
      (item) => item.type === 'object' && item.system.objectType === 'container'
    );
    this.sort.set((a, b) => a.sort - b.sort);
  }
}
class JewelryMapReducer extends DerivedMapReducer {
  initialize() {
    this.filters.add(
      (item) => item.type === 'object' && item.system.objectType === 'jewelry'
    );
    this.sort.set((a, b) => a.sort - b.sort);
  }
}
class MiscellaneousMapReducer extends DerivedMapReducer {
  initialize() {
    this.filters.add(
      (item) => item.type === 'object' && item.system.objectType === 'miscellaneous'
    );
    this.sort.set((a, b) => a.sort - b.sort);
  }
}
class ShieldMapReducer extends DerivedMapReducer {
  initialize() {
    this.filters.add(
      (item) => item.type === 'object' && item.system.objectType === 'shield'
    );
    this.sort.set((a, b) => a.sort - b.sort);
  }
}
class ToolMapReducer extends DerivedMapReducer {
  initialize() {
    this.filters.add(
      (item) => item.type === 'object' && item.system.objectType === 'tool'
    );
    this.sort.set((a, b) => a.sort - b.sort);
  }
}

class WeaponsMapReducer extends DerivedMapReducer {
  initialize() {
    this.filters.add(
      (item) => item.type === 'object' && item.system.objectType === 'weapon'
    );
    this.sort.set((a, b) => a.sort - b.sort);
  }
}

export default class ObjectMapReducer extends DynMapReducer {
  initialize() {
    this.filters.add((item) => item.type === 'object');
    this.sort.set((a, b) => a.sort - b.sort);

    this._types = {
      ammunition: this.derived.create(AmmunitionMapReducer),
      armors: this.derived.create(ArmorMapReducer),
      clothing: this.derived.create(ClothingMapReducer),
      consumables: this.derived.create(ConsumableMapReducer),
      containers: this.derived.create(ContainerMapReducer),
      jewelry: this.derived.create(JewelryMapReducer),
      miscellaneous: this.derived.create(MiscellaneousMapReducer),
      shields: this.derived.create(ShieldMapReducer),
      tools: this.derived.create(ToolMapReducer),
      weapons: this.derived.create(WeaponsMapReducer)
    };
  }

  get ammunition() { return this._types.ammunition; }

  get armors() { return this._types.armors; }

  get clothing() { return this._types.clothing; }

  get consumables() { return this._types.consumables; }

  get containers() { return this._types.containers; }

  get jewelry() { return this._types.jewelry; }

  get miscellaneous() { return this._types.miscellaneous; }

  get shields() { return this._types.shields; }

  get tools() { return this._types.tools; }

  get weapons() { return this._types.weapons; }
}
