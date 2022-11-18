import { DynMapReducer } from '@typhonjs-fvtt/runtime/svelte/store';

export default class SpellMapReducer extends DynMapReducer {
  initialize() {
    this.filters.add((item) => item.type === 'spell');
    this.sort.set((a, b) => a.sort - b.sort);

    this._levels = {
      zero: this.derived.create('zero'),
      one: this.derived.create('one'),
      two: this.derived.create('two'),
      three: this.derived.create('three'),
      four: this.derived.create('four'),
      five: this.derived.create('five'),
      six: this.derived.create('six'),
      seven: this.derived.create('seven'),
      eight: this.derived.create('eight'),
      nine: this.derived.create('nine')
    };

    Object.values(this._levels).forEach((reducer, idx) => {
      reducer.filters.add((item) => item.system.level === idx - 1);
    });
  }

  get zero() { return this._levels.zero; }

  get one() { return this._levels.one; }

  get two() { return this._levels.two; }

  get three() { return this._levels.three; }

  get four() { return this._levels.four; }

  get five() { return this._levels.five; }

  get six() { return this._levels.six; }

  get seven() { return this._levels.seven; }

  get eight() { return this._levels.eight; }

  get nine() { return this._levels.nine; }
}
