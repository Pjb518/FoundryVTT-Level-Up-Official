import DataProxy from './DataProxy';

import GenericConfigDialog from '../apps/dialogs/initializers/GenericConfigDialog';

import ActionConfigDialog from '../apps/dialogs/ActionConfigDialog.svelte';

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
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
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

  async add(data = {}, update = true, returnId = false) {
    return ActionsManager.addAction(this.#item, data, update, returnId);
  }

  configure(actionId) {
    const actionName = this.#item.system.actions[actionId].name;

    let dialog = this.#item.dialogs.actions[actionId];

    if (!dialog) {
      this.#item.dialogs.actions[actionId] ??= new GenericConfigDialog(
        this.#item,
        actionName,
        ActionConfigDialog,
        { actionId, actionName },
        {
          width: 555, height: 592, resizable: true, isItemDocument: true
        }
      );

      dialog = this.#item.dialogs.actions[actionId];
    }

    dialog.render(true);
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

  async remove(actionId) {
    // Close dialog
    const dialog = this.#item.dialogs.actions[actionId];
    await dialog?.close();
    delete this.#item.dialogs.actions[actionId];

    await this.#item.update({
      'system.actions': {
        [`-=${actionId}`]: null
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
  static async addAction(item, data = {}, update = true, returnId = false) {
    const newAction = foundry.utils.mergeObject({
      name: this.getActionName(item) || 'New Action',
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
          rechargeType: 'custom',
          rechargeAmount: '1',
          threshold: 6
        }
      }
    }, data);

    const id = foundry.utils.randomID();

    // Add Consumers
    let consumer = null;
    if (item.system.uses?.max) consumer = await this.addConsumer(item, [id, newAction], 'itemUses', {}, false);
    if (item.type === 'spell') consumer = await this.addConsumer(item, [id, newAction], 'spell', {}, false);
    else if (item.type === 'maneuver') {
      consumer = await this.addConsumer(item, [id, newAction], 'resource', { resource: 'exertion' }, false);
    }

    if (consumer) {
      newAction.consumers = {
        ...newAction.consumers,
        ...(Object.values(consumer)[0])
      };
    }

    const updateData = {
      'system.actions': {
        ...item.system.actions,
        [id]: newAction
      }
    };

    if (update) await item.update(updateData);
    if (returnId) return [id, updateData];
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

    if (['ammunition', 'quantity'].includes(type)) {
      defaultData.itemId = '';
      defaultData.quantity = 1;
    }

    if (type === 'hitDice') {
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

  static getActionName(item) {
    const type = game.settings.get('a5e', 'newActionNameType');

    if (type === 'action') return 'New Action';
    if (type === 'item') return item.name ?? 'New Action';

    const itemType = item.type;

    if (itemType === 'feature') return 'Use Feature';
    if (itemType === 'maneuver') return 'Execute';
    if (itemType === 'spell') return 'Cast Spell';

    if (itemType === 'object') {
      const { objectType } = item.system;

      if (objectType === 'consumable') return 'Consume';
      if (objectType === 'tool') return 'Use Tool';
      if (objectType === 'weapon') return 'Attack';

      return 'Use Object';
    }

    return 'New Action';
  }
}
