import type { Action } from 'types/action';
import type { ItemA5e } from '../documents/item/item';

import GenericConfigDialog from '../apps/dialogs/initializers/GenericConfigDialog';
import ActionConfigDialog from '../apps/dialogs/ActionConfigDialog.svelte';

class ActionsManager extends Map<string, Action> {
  #item: ItemA5e;

  default: Action | null;

  constructor(item: ItemA5e) {
    super();

    this.#item = item;

    const { actions } = item.system;
    Object.entries(actions ?? {}).forEach(([actionId, action]) => {
      action.id = actionId;
      this.set(actionId, action);
    });

    // Set default action
    const defaultAction = [...this.values()].find((a) => a.default);
    if (defaultAction) {
      this.default = defaultAction;
    } else if (!defaultAction && this.size > 0) {
      this.default = this.first!;
    } else {
      this.default = null;
    }
  }

  /** ************************************************
   * Getters
   * ************************************************ */
  get count(): number {
    return this.size;
  }

  get first(): Action | null {
    const action = this.values().next();
    if (!action) return null;
    return action.value;
  }

  get activationTypes(): Set<string> {
    return [...this.values()].reduce((acc, action) => {
      if (action.activation.type) acc.add(action.activation.type);
      return acc;
    }, new Set<string>());
  }

  get hasArea(): boolean {
    return [...this.values()].some((action) => (!!Object.values(action.areas)?.length));
  }

  get hasConsumer(): boolean {
    return [...this.values()].some((action) => (!!Object.values(action.consumers)?.length));
  }

  get hasPrompt(): boolean {
    return [...this.values()].some((action) => (!!Object.values(action.prompts)?.length));
  }

  get hasRange(): boolean {
    return [...this.values()].some((action) => (!!Object.values(action.ranges)?.length));
  }

  get hasRoll(): boolean {
    return [...this.values()].some((action) => (!!Object.values(action.rolls)?.length));
  }

  /** ************************************************
   * Get actions or subsections
   * ************************************************ */
  getName(name: string): Action | undefined {
    return [...this.values()].find((action) => action.name === name);
  }

  getAreas(actionId: string) {
    return Object.entries(this.get(actionId)?.areas ?? {});
  }

  getConsumers(actionId: string) {
    return Object.entries(this.get(actionId)?.consumers ?? {});
  }

  getPrompts(actionId: string) {
    return Object.entries(this.get(actionId)?.prompts ?? {});
  }

  getRolls(actionId: string) {
    return Object.entries(this.get(actionId)?.rolls ?? {});
  }

  /** ************************************************
   * Helpers
   * ************************************************ */
  async setDefaultAction(actionId: string) {
    const updates: Record<string, any> = {};

    [...this.values()].forEach((action) => {
      if (action.id === actionId) {
        updates[`system.actions.${action.id}.default`] = true;
      } else {
        updates[`system.actions.${action.id}.default`] = false;
      }
    });

    await this.#item.update(updates);
  }

  /** ************************************************
   * Internal methods
   * ************************************************ */
  async add(data: Record<string, any> = {}, update = true, returnId = false) {
    return ActionsManager.addAction(this.#item, data, update, returnId);
  }

  configure(actionId: string): void {
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

  /** ----------------------------------------- */
  async duplicate(id: string) {
    const original = this.get(id);
    if (!original) return;

    const newAction = original.toObject();
    const newActionId = foundry.utils.randomID();
    newAction.name = `${newAction.name} (Copy)`;

    // TODO: Remove support for this
    // Get effect prompts
    const prompts = Object.entries(newAction.prompts ?? {})
      .filter(([, prompt]) => prompt.type === 'effect');

    if (prompts.length) {
      for await (const [promptId, prompt] of prompts) {
        const effect = this.#item.effects.get(prompt.effectId);
        if (!effect) return;

        // Duplicate effect
        const effectData = foundry.utils.duplicate(effect);
        foundry.utils.setProperty(effectData, 'flags.a5e.actionId', newActionId);
        const newEffect = await this.#item.createEmbeddedDocuments('ActiveEffect', [effectData]);
        newAction.prompts[promptId].effectId = newEffect[0].id;
      }
    }

    await this.#item.update({
      'system.actions': {
        ...this.#item.system.actions,
        [newActionId]: newAction
      }
    });
  }

  /** ----------------------------------------- */

  async remove(actionId: string) {
    // Close dialog
    const dialog = this.#item.dialogs.actions[actionId];
    await dialog?.close();
    delete this.#item.dialogs.actions[actionId];

    await this.#item.update({
      'system.actions': {
        [`-=${actionId}`]: null
      }
    });

    // Remove any effects associated with the action
    const effects = this.#item.effects.filter(
      (effect) => effect.flags.a5e.actionId === actionId
    );

    this.#item.deleteEmbeddedDocuments('ActiveEffect', effects.map((effect) => effect.id));
  }

  /** ************************************************
   * Static Methods
   * ************************************************ */
  static async addAction(
    item: ItemA5e,
    data: Record<string, any> = {},
    update = true,
    returnId = false
  ) {
    const newAction = foundry.utils.mergeObject({
      name: this.getActionName(item) || 'New Action'
    }, data) as Action;

    const id = foundry.utils.randomID();

    let consumer: Record<string, any> | null = null;
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

  /** ----------------------------------------- */

  static async addRoll(
    item: ItemA5e,
    action: [string, Action],
    type: string, // TODO: Switch to roll types
    data: Record<string, any> = {},
    update = true
  ) {
    const defaultData: Record<string, any> = {
      type,
      default: true
    };

    if (type === 'attack') {
      if (Object.keys(action[1]?.rolls).length > 0) {
        ui.notifications?.error('Only one attack roll is allowed per action.');
        return null;
      }

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

  /** ----------------------------------------- */

  static async addPrompt(
    item: ItemA5e,
    action: [string, Action],
    type: string, // TODO: Change to prompt types
    data: Record<string, any> = {},
    update = true
  ) {
    const defaultData: Record<string, any> = {
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

  /** ----------------------------------------- */

  static async addConsumer(
    item: ItemA5e,
    action: [string, Action],
    type: string, // TODO: Use consumer types here
    data: Record<string, any> = {},
    update = true
  ) {
    const defaultData: Record<string, any> = {
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
      defaultData.classIdentifier = '';
      defaultData.resource = '';
      defaultData.quantity = 1;
    }

    if (type === 'spell') {
      defaultData.mode = 'variable';
      defaultData.charges = item.isType('spell') ? item.system.level ?? 1 : 1;
      defaultData.spellLevel = item.isType('spell') ? item.system.level ?? 1 : 1;
      defaultData.points = item.isType('spell') ? CONFIG.A5E.spellLevelCost?.[item.system.level] ?? 1 : 1;
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

  /** ----------------------------------------- */

  static getActionName(item: ItemA5e): string {
    const type = game.settings.get('a5e', 'newActionNameType');

    if (type === 'action') return 'New Action';
    if (type === 'item') return item.name ?? 'New Action';

    const itemType = item.type;

    if (itemType === 'feature') return 'Use Feature';
    if (itemType === 'maneuver') return 'Execute';
    if (itemType === 'spell') return 'Cast Spell';

    if (item.isType('object')) {
      const { objectType } = item.system;

      if (objectType === 'consumable') return 'Consume';
      if (objectType === 'tool') return 'Use Tool';
      if (objectType === 'weapon') return 'Attack';

      return 'Use Object';
    }

    return 'New Action';
  }
}

export { ActionsManager };
