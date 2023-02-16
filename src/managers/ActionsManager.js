import DataProxy from './DataProxy';

export default class ActionsManager extends DataProxy {
  #actions;

  #item;

  constructor(item) {
    const { actions } = item.system;
    super(actions);

    this.#actions = actions;
    this.#item = item;
  }

  /**
   *
   * @returns {Array}
   */
  entries() {
    return Object.entries(this.#actions);
  }

  /**
   *
   * @param {String} id
   */
  get(id) {
    return this.#actions[id] ?? null;
  }

  /**
   *
   * @param {String} name
   */
  getName(name) {
    // eslint-disable-next-line no-unused-vars
    const actionId = this.entries().find(([_, action]) => action.name === name)?.[0];
    return this.#actions[actionId] ?? null;
  }

  add() { }

  async duplicate(id) {
    const newAction = foundry.utils.duplicate(this.#actions[id]);
    newAction.name = `${newAction.name} (Copy)`;

    await this.#item.update({
      'system.actions': {
        ...this.#actions,
        [foundry.utils.randomId()]: newAction
      }
    });
  }

  remove() { }

  update() { }
}
