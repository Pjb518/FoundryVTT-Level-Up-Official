// import { DynMapReducer } from '#runtime/svelte/store/reducer';

export default class FeatureMapReducer extends DynMapReducer {
  initialize() {
    this.filters.add((item) =>
      [
        "archetype",
        "feature",
        "background",
        "culture",
        "destiny",
        "heritage",
        "class",
        "subclass",
      ].includes(item.type),
    );
    this.sort.set((a, b) => a.sort - b.sort);

    this._types = {};
    Object.keys(CONFIG.A5E.featureTypes).forEach((key) => {
      this._types[key] = this.derived.create(key);
    });

    Object.entries(this._types).forEach(([key, reducer]) => {
      reducer.filters.add((item) => {
        if (item.system.featureType === key || item.type === key) return true;
        if (item.type === "archetype" && key === "class") return true;
        return false;
      });
    });

    this._types.Uncategorized = this.derived.create("uncategorized");
    this._types.Uncategorized.filters.add(
      (item) => item.system.featureType === "",
    );
  }
}
