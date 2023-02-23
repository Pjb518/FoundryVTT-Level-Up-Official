import DataProxy from './DataProxy';

import ActionConfigDialog from '../apps/dialogs/initializers/ActionConfigDialog';

export default class ActionsManager extends DataProxy {
  #item;

  constructor(item) {
    super(item.system.actions);

    this.#item = item;
  }

  get count() {
    return Object.keys(this.#item.system.actions).length;
  }

  /**
   *
   * @returns {Array}
   */
  entries() {
    return Object.entries(this.#item.system.actions);
  }

  /**
   *
   * @param {String} id
   */
  get(id) {
    return this.#item.system.actions[id] ?? null;
  }

  /**
   *
   * @param {String} name
   */
  getName(name) {
    // eslint-disable-next-line no-unused-vars
    const actionId = this.entries().find(([_, action]) => action.name === name)?.[0];
    return this.#item.system.actions[actionId] ?? null;
  }

  keys() {
    return Object.keys(this.#item.system.actions);
  }

  values() {
    return Object.values(this.#item.system.actions);
  }

  async add() {
    const newAction = {
      name: 'New Action'
    };

    await this.#item.update({
      'system.actions': {
        ...this.#item.system.actions,
        [foundry.utils.randomId()]: newAction
      }
    });
  }

  async duplicate(id) {
    const newAction = foundry.utils.duplicate(this.#item.system.actions[id]);
    newAction.name = `${newAction.name} (Copy)`;

    await this.#item.update({
      'system.actions': {
        ...this.#item.system.actions,
        [foundry.utils.randomId()]: newAction
      }
    });
  }

  async remove(id) {
    await this.#item.update({
      'system.actions': {
        [`-=${id}`]: null
      }
    });
  }

  configure(id) {
    const actionName = this.#item.system.actions[id].name;
    new ActionConfigDialog(this.#item, id, actionName).render(true);
  }
}
