export default class ActionsManager {
  constructor(item) {
    this.actions = item.system.actions; // This mutates original object.
  }

  /**
   *
   * @returns {Array}
   */
  entries() {
    return Object.entries(this.actions);
  }

  /**
   *
   * @param {String} id
   */
  get(id) {
    return this.actions[id] ?? null;
  }

}
