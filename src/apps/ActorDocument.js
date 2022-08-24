import { TJSDocument } from '@typhonjs-fvtt/runtime/svelte/store';

import FavoriteMapReducer from './reducers/FavoriteMapReducer';
import FeatureMapReducer from './reducers/FeatureMapReducer';
import ManeuverMapReducer from './reducers/ManeuverMapReducer';
import ObjectMapReducer from './reducers/ObjectMapReducer';
import SpellMapReducer from './reducers/SpellMapReducer';

export default class ActorDocument extends TJSDocument {
  #favorites;

  #features;

  #maneuvers;

  #objects;

  #spells;

  constructor(doc, options) {
    super(doc, options);

    this.#favorites = this.embedded.create('Item', FavoriteMapReducer);
    this.#features = this.embedded.create('Item', FeatureMapReducer);
    this.#maneuvers = this.embedded.create('Item', ManeuverMapReducer);
    this.#objects = this.embedded.create('Item', ObjectMapReducer);
    this.#spells = this.embedded.create('Item', SpellMapReducer);
  }

  get favorites() { return this.#favorites; }

  get features() { return this.#features; }

  get maneuvers() { return this.#maneuvers; }

  get objects() { return this.#objects; }

  get spells() { return this.#spells; }
}
