import DataProxy from './DataProxy';

import ActionConfigDialog from '../apps/dialogs/initializers/ActionConfigDialog';

export default class ActionsManager extends DataProxy {
  #item;

  constructor(item) {
    super(item.system.actions);

    this.#item = item;
  }

  get count() {
    return Object.keys(this.#item.system.actions ?? {}).length;
  }

  /**
   *
   * @returns {Array}
   */
  entries() {
    return Object.entries(this.#item.system.actions ?? {});
  }

  keys() {
    return Object.keys(this.#item.system.actions ?? {});
  }

  values() {
    return Object.values(this.#item.system.actions ?? {});
  }

  /** ************************************************ */
  /**
   * @param {String} id
   */
  get(id) {
    return this.#item.system.actions?.[id];
  }

  /**
   * @param {String} name
   */
  getName(name) {
    // eslint-disable-next-line no-unused-vars
    const actionId = this.entries().find(([_, action]) => action.name === name)?.[0];
    return this.#item.system.actions?.[actionId] ?? null;
  }

  /** ************************************************ */
  // Subsection getters
  getRolls(actionId) {
    return Object.entries(this.get(actionId)?.rolls ?? {});
  }

  getPrompts(actionId) {
    return Object.entries(this.get(actionId)?.prompts ?? {});
  }

  getConsumers(actionId) {
    return Object.entries(this.get(actionId)?.consumers ?? {});
  }

  /** ************************************************ */
  get activationTypes() {
    const actions = Object.values(this.#item.system.actions ?? {});

    return actions.reduce((acc, action) => {
      if (action.activation?.type) acc.add(action.activation.type);
      return acc;
    }, new Set());
  }

  get hasRoll() {
    const { actions } = this.#item.system;
    return Object.values(actions).some((action) => (!!Object.values(action.rolls)?.length));
  }

  get hasPrompt() {
    const { actions } = this.#item.system;
    return Object.values(actions).some((action) => (!!Object.values(action.prompts)?.length));
  }

  get hasConsumer() {
    const { actions } = this.#item.system;
    return Object.values(actions).some((action) => (!!Object.values(action.consumers)?.length));
  }

  get hasRange() {
    const { actions } = this.#item.system;
    return Object.values(actions).some((action) => (!!Object.values(action.ranges)?.length));
  }

  /** ************************************************ */
  async add(name = 'New Action', data = {}) {
    const newAction = { name };

    await this.#item.update({
      'system.actions': {
        ...this.#item.system.actions,
        [foundry.utils.randomID()]: Object.keys(data).length ? data : newAction
      }
    });
  }

  configure(id) {
    const actionName = this.#item.system.actions[id].name;
    new ActionConfigDialog(this.#item, id, actionName).render(true);
  }

  async duplicate(id) {
    const newAction = foundry.utils.duplicate(this.#item.system.actions[id]);
    newAction.name = `${newAction.name} (Copy)`;

    await this.#item.update({
      'system.actions': {
        ...this.#item.system.actions,
        [foundry.utils.randomID()]: newAction
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
}
