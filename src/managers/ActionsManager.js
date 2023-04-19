import DataProxy from './DataProxy';

import ActionConfigDialog from '../apps/dialogs/initializers/ActionConfigDialog';

export default class ActionsManager extends DataProxy {
  #item;

  constructor(item) {
    super(item.system.actions);

    this.#item = item;
  }

  /** ************************************************
   * Getters
   * ************************************************ */
  get count() {
    return Object.keys(this.#item.system.actions ?? {}).length;
  }

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

  /** ************************************************
   * Iterator Returns
   * ************************************************ */
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

  /** ************************************************
   * Get actions or subsections
   * ************************************************ */
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

  getRolls(actionId) {
    return Object.entries(this.get(actionId)?.rolls ?? {});
  }

  getPrompts(actionId) {
    return Object.entries(this.get(actionId)?.prompts ?? {});
  }

  getConsumers(actionId) {
    return Object.entries(this.get(actionId)?.consumers ?? {});
  }

  /** ************************************************
   * Internal methods
   * ************************************************ */

  async add(data = {}) {
    await ActionsManager.addAction(this.#item, data);
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

  /** ************************************************
   * Static Methods
   * ************************************************ */
  /**
   *
   * @param {ItemA5E} item
   * @param {Object} data
   * @param {Boolean} update
   * @returns {Action}
   */
  static async addAction(item, data = {}, update = true) {
    const newAction = foundry.utils.mergeObject({
      name: 'New Action',
      activation: {},
      consumers: {},
      rolls: {},
      prompts: {},
      uses: {
        value: 0,
        max: '',
        per: '',
        recharge: {
          formula: '1d6',
          threshold: 6
        }
      }
    }, data);

    const updateData = {
      'system.actions': {
        ...item.system.actions,
        [foundry.utils.randomID()]: newAction
      }
    };

    if (update) await item.update(updateData);
    return updateData;
  }

  /**
   *
   * @param {ItemA5E} item
   * @param {Array<String, Action>} action
   * @param {String} type
   * @param {Object} data
   * @param {Boolean} update
   * @returns {Object}
   */
  static async addRoll(item, action, type, data = {}, update = true) {
    const defaultData = {
      type,
      default: true
    };

    if (type === 'attack') {
      // TODO: Throw error on multiple attack rolls
      defaultData.attackType = 'meleeWeaponAttack';
      defaultData.proficient = true;
    }

    if (type === 'abilityCheck' || type === 'savingThrow') {
      defaultData.ability = 'str';
    }

    if (type === 'skillCheck') {
      defaultData.skill = 'acr';
      defaultData.ability = 'none';
    }

    if (type === 'toolCheck') {
      defaultData.tool = 'airVehicles';
      defaultData.ability = 'none';
    }

    const updateData = {
      [`system.actions.${action[0]}.rolls`]: {
        ...action[1].rolls,
        [foundry.utils.randomID()]: foundry.utils.mergeObject(defaultData, data)
      }
    };

    if (update) item.update(updateData);
    return updateData;
  }

  /**
   *
   * @param {ItemA5E} item
   * @param {Array<String, Action>} action
   * @param {String} type
   * @param {Object} data
   * @param {Boolean} update
   * @returns {Object}
   */
  static async addPrompt(item, action, type, data = {}, update = true) {
    const defaultData = {
      type,
      default: true
    };

    if (type === 'savingThrow' || type === 'abilityCheck') {
      defaultData.ability = 'str';
    }

    if (type === 'savingThrow') {
      defaultData.saveDC = { type: 'spellcasting' };
    }

    if (type === 'skillCheck') {
      defaultData.skill = 'acr';
    }

    const updateData = {
      [`system.actions.${action[0]}.prompts`]: {
        ...action[1].prompts,
        [foundry.utils.randomID()]: foundry.utils.mergeObject(defaultData, data)
      }
    };

    if (update) item.update(updateData);
    return updateData;
  }

  /**
   *
   * @param {ItemA5E} item
   * @param {Array<String, Action>} action
   * @param {String} type
   * @param {Object} data
   * @param {Boolean} update
   * @returns {Object}
   */
  static async addConsumer(item, action, type, data = {}, update = true) {
    const defaultData = {
      type,
      default: true
    };

    if (type === 'ammunition') {
      defaultData.itemId = '';
      defaultData.quantity = 1;
    }

    if (type === 'hitDice') {
      defaultData.quantity = 1;
    }

    if (type === 'quantity') {
      defaultData.itemId = '';
      defaultData.quantity = 1;
    }

    if (type === 'resource') {
      defaultData.resource = '';
      defaultData.quantity = 1;
    }

    if (type === 'spell') {
      defaultData.mode = 'variable';
      defaultData.spellLevel = item.system.level ?? 1;
      defaultData.points = CONFIG.A5E.spellLevelCost?.[item.system.level] ?? 1;
    }

    if (['actionUses', 'itemUses'].includes(type)) data.quantity = 1;

    const updateData = {
      [`system.actions.${action[0]}.consumers`]: {
        ...action[1].consumers,
        [foundry.utils.randomID()]: foundry.utils.mergeObject(defaultData, data)
      }
    };

    if (update) item.update(updateData);
    return updateData;
  }
}
