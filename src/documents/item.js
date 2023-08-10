/* eslint-disable no-unused-vars */
import computeSaveDC from '../utils/computeSaveDC';
import getAttackAbility from '../utils/getAttackAbility';
import getDeterministicBonus from '../dice/getDeterministicBonus';
import getRollFormula from '../utils/getRollFormula';
import overrideRollMode from '../utils/overrideRollMode';
import overrideExpertiseDie from '../utils/overrideExpertiseDie';
import prepareConsumers from '../apps/dataPreparationHelpers/itemActivationConsumers/prepareConsumers';
import prepareDamageBonuses from '../apps/dataPreparationHelpers/itemActivationRolls/prepareDamageBonuses';
import prepareHealingBonuses from '../apps/dataPreparationHelpers/itemActivationRolls/prepareHealingBonuses';
import prepareHitDice from '../apps/dataPreparationHelpers/prepareHitDice';
import preparePrompts from '../apps/dataPreparationHelpers/itemActivationPrompts/preparePrompts';
import prepareRolls from '../apps/dataPreparationHelpers/itemActivationRolls/prepareRolls';

import ActionActivationDialog from '../apps/dialogs/initializers/ActionActivationDialog';
import ActionSelectionDialog from '../apps/dialogs/initializers/ActionSelectionDialog';

import ActionsManager from '../managers/ActionsManager';
import ForeignDocumentManager from '../managers/ForeignDocumentManager';
import ResourceConsumptionManager from '../managers/ResourceConsumptionManager';
import RollPreparationManager from '../managers/RollPreparationManager';
import TemplatePreparationManager from '../managers/TemplatePreparationManager';

import MigrationRunnerBase from '../migration/MigrationRunnerBase';

/**
 * Override and extend the basic Item implementation.
 * @extends {Item}
 */
export default class ItemA5e extends Item {
  get actions() {
    return new ActionsManager(this);
  }

  // *****************************************************************************************
  prepareDerivedData() {
    if (['object', 'feature'].includes(this.type)) this.prepareArmorData();
    if (this.type === 'object' && this.system.objectType === 'container') this.prepareContainer();
    if (['culture', 'background', 'heritage'].includes(this.type)) this.prepareForeignDocuments();
  }

  prepareArmorData() {
    const itemData = this.system;

    // Calculate AC formula
    const { baseFormula, maxDex } = itemData.ac ?? {};
    if (!baseFormula) return;

    let formula = baseFormula;
    if (maxDex && maxDex > 0) {
      formula = baseFormula
        .replaceAll(/@dex\.mod|@abilities\.dex\.mod/gm, `min(@dex.mod, ${maxDex})`);
    }

    if (itemData.damagedState === CONFIG.A5E.DAMAGED_STATES.BROKEN) {
      if (itemData.objectType === 'armor') {
        formula = `10 + max(floor((${formula}) / 2), 1)`;
      } else formula = `max(floor((${formula}) / 2), 1)`;
    }

    foundry.utils.setProperty(this, 'system.ac.formula', formula);
  }

  prepareContainer() {
    foundry.utils.setProperty(this, 'containerItems', new ForeignDocumentManager(
      this,
      'items',
      { validate: (obj) => obj.type === 'object' }
    ));
  }

  prepareForeignDocuments() {
    if (this.type === 'culture') {
      foundry.utils.setProperty(this, 'features', new ForeignDocumentManager(
        this,
        'features',
        { validate: (obj) => obj.type === 'feature' && obj.system?.featureType === 'culture' }
      ));
    }

    if (['background', 'culture'].includes(this.type)) {
      foundry.utils.setProperty(this, 'equipment', new ForeignDocumentManager(
        this,
        'equipment',
        { validate: (obj) => obj.type === 'object' }
      ));
    }

    if (this.type === 'heritage') {
      const types = ['features', 'gifts', 'paragonGifts'];

      types.forEach((type) => {
        foundry.utils.setProperty(this, type, new ForeignDocumentManager(
          this,
          type,
          { validate: (obj) => obj.type === 'feature' && obj.system?.featureType === 'heritage' }
        ));
      });
    }
  }

  // *****************************************************************************************

  /**
   * A handler for activating an item. An actionId can be passed to this method to use a specific
   * action defined on the item. If there are no actions defined, this method defaults to
   * outputting the item's description.
   *
  //  * This method accepts an options object to further customize the activation process.
   *
   * @param {string} actionId
   * @param {object options
   * @returns
   */
  async activate(actionId, options = {}) {
    // Do not allow an item to activate if it not attached to an actor or if the user does
    // not have owner permissions for the actor.
    if (!this.actor || !this?.actor.isOwner) return;

    if (this.actions.count === 0) {
      // If no actions are defined, default to outputting just the item description.
      this.shareItemDescription();
    } else if (this.actions.count === 1) {
      // If there is a single defined action, use that action.
      this.#activateAction(this.actions.keys()[0], options);
    } else if (actionId) {
      // If an action is provided, use the provided action
      this.#activateAction(actionId, options);
    } else {
      // If no action id was provided, and there is more then one action defined for the item,
      // show a dialog window so that the user can select an appropriate action.
      const dialog = new ActionSelectionDialog(this);
      await dialog.render(true);

      const promise = await dialog.promise;

      // If no selection is made, cancel the activation.
      if (!promise?.actionId) return;

      this.#activateAction(promise.actionId, options);
    }
  }

  async showActionActivationDialog(actionId, action) {
    if (
      !foundry.utils.isEmpty(action?.rolls)
      || !foundry.utils.isEmpty(action?.prompts)
    ) { return true; }

    // Check if consumers need a dialog
    const consumerTypes = new Set(
      Object.values(action?.consumers ?? {}).map((c) => c.type)
    );

    if (consumerTypes.intersects(CONFIG.A5E.configurableConsumers)) {
      return true;
    }

    return false;
  }

  async #activateAction(actionId, options) {
    let activationData;
    const action = this.actions[actionId];

    if (options.skipRollDialog) {
      activationData = this.#getDefaultActionActivationData(actionId, options);
    } else {
      activationData = await this.#showActionActivationPrompt(actionId, options);
    }

    if (!activationData) return null;

    activationData.rolls ??= [];
    activationData.rolls.push(activationData?.attack ?? {});

    const rollPreparationManager = new RollPreparationManager({
      actor: this.actor,
      item: this,
      consumers: activationData.consumers ?? {},
      damageBonuses: activationData.damageBonuses ?? {},
      healingBonuses: activationData.healingBonuses ?? {},
      rolls: activationData.rolls ?? {}
    });

    const rolls = await rollPreparationManager.prepareRolls();

    const templateManager = new TemplatePreparationManager(
      this.actor,
      this,
      action,
      activationData.consumers ?? {}
    );

    const validTemplate = templateManager.validateBaseTemplateData();
    if (activationData.placeTemplate && validTemplate) {
      await templateManager.placeActionTemplates();
    }

    const resourceConsumptionManager = new ResourceConsumptionManager(
      this.actor,
      this,
      actionId,
      activationData.consumers ?? {}
    );

    await resourceConsumptionManager.consumeResources();

    const chatData = {
      user: game.user?.id,
      speaker: ChatMessage.getSpeaker({ actor: this }),
      type: rolls.length ? CONST.CHAT_MESSAGE_TYPES.ROLL : CONST.CHAT_MESSAGE_TYPES.OTHER,
      sound: CONFIG.sounds.dice,
      rolls: rolls.map(({ roll }) => roll),
      rollMode: activationData.visibilityMode ?? game.settings.get('core', 'rollMode'),
      flags: {
        a5e: {
          actorId: this.actor.uuid,
          itemId: this.uuid,
          cardType: 'item',
          castingLevel: activationData.consumers?.spell?.level ?? this.system.level ?? null,
          img: action.img ?? this.img ?? 'icons/svg/item-bag.svg',
          name: this.name,
          actionName: action.name,
          actionDescription: action?.descriptionOutputs?.includes('action')
            ? await TextEditor.enrichHTML(action.description, {
              async: true
            })
            : null,
          itemDescription: action?.descriptionOutputs?.includes('item') ?? true
            ? await TextEditor.enrichHTML(this.system.description, {
              async: true
            })
            : null,
          unidentifiedDescription: action?.descriptionOutputs?.includes('item') ?? true
            ? TextEditor.enrichHTML(this.system.unidentifiedDescription, {
              async: false
            })
            : null,
          prompts: activationData.prompts,
          rollData: rolls.map(({ roll, ...rollData }) => rollData)
        }
      },
      content: '<article></article>'
    };

    ChatMessage.applyRollMode(chatData, activationData.visibilityMode ?? game.settings.get('core', 'rollMode'));
    const chatCard = await ChatMessage.create(chatData);

    Hooks.callAll('a5e.itemActivate', this, {
      actionId, action, dialog: activationData, options, rolls, validTemplate
    });

    return chatCard;
  }

  async shareItemDescription(action) {
    const chatData = {
      user: game.user?.id,
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flags: {
        a5e: {
          actorId: this.actor.uuid,
          itemId: this.uuid,
          cardType: 'item',
          actionDescription: action?.descriptionOutputs?.includes('action')
            ? await TextEditor.enrichHTML(action.description, {
              async: true
            })
            : null,
          itemDescription: action?.descriptionOutputs?.includes('item') ?? true
            ? await TextEditor.enrichHTML(this.system.description, {
              async: true
            })
            : null,
          unidentifiedDescription: action?.descriptionOutputs?.includes('item') ?? true
            ? TextEditor.enrichHTML(this.system.unidentifiedDescription, {
              async: false
            })
            : null,
          img: this.img,
          name: this.name
        }
      },
      content: '<article></article>'
    };

    ChatMessage.applyRollMode(chatData, game.settings.get('core', 'rollMode'));
    const chatCard = ChatMessage.create(chatData);

    Hooks.callAll('a5e.itemActivate', this, { action });
    return chatCard;
  }

  async #showActionActivationPrompt(actionId, options) {
    const dialog = new ActionActivationDialog({
      actionId,
      options,
      actorDocument: this.actor,
      itemDocument: this
    });

    dialog.render(true);
    return dialog.promise;
  }

  #getDefaultActionActivationData(actionId, options) {
    const action = this.actions[actionId];

    if (!action) return null;

    const rolls = prepareRolls(action.rolls);

    const attack = this.#getDefaultAttackRollData(rolls.attack, options);
    const consumers = this.#getDefaultConsumerData(prepareConsumers(action.consumers));
    const { damageBonuses, healingBonuses } = this.#getDefaultBonuses(this.actor, rolls);
    const otherRolls = this.#getDefaultRollData(rolls);
    const prompts = this.#getDefaultPrompts(action.prompts);

    return {
      attack,
      consumers,
      damageBonuses,
      healingBonuses,
      prompts,
      rolls: otherRolls
    };
  }

  #getDefaultAttackRollData(attack, options) {
    if (!attack) return {};

    const { actor } = this;
    const attackRoll = attack[0][1];
    const attackAbility = getAttackAbility(actor, this, attackRoll);
    const expertiseDie = overrideExpertiseDie(actor, 0);

    const rollMode = overrideRollMode(
      actor,
      options.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL,
      {
        attackType: attackRoll.attackType,
        type: 'attack'
      }
    );

    const formula = getRollFormula(actor, {
      ability: attackAbility,
      attackBonus: attackRoll?.bonus,
      attackType: attackRoll?.type,
      expertiseDie,
      proficient: attackRoll?.proficient ?? true,
      rollMode,
      situationalMods: options.situationalMods,
      type: 'attack'
    });

    return {
      bonus: attackRoll.bonus ?? '',
      critThreshold: attackRoll.critThreshold ?? 20,
      type: 'attack',
      attackType: attackRoll.attackType ?? 'meleeWeaponAttack',
      ability: attackAbility,
      rollMode,
      formula
    };
  }

  #getDefaultConsumerData(consumers) {
    // Prepare the default action uses data.
    const actionUsesData = {};
    const actionConsumer = this.#getConsumerFromPreparedConsumers(consumers, 'actionUses');
    if (!foundry.utils.isEmpty(actionConsumer)) {
      actionUsesData.quantity = actionConsumer?.quantity ?? 1;
      actionUsesData.baseUses = actionConsumer?.quantity ?? 1;
    }

    // Prepare the default hit-dice data.
    const hitDiceData = {};
    const hitDiceConsumer = this.#getConsumerFromPreparedConsumers(consumers, 'hitDice');
    if (!foundry.utils.isEmpty(hitDiceConsumer)) {
      const availableHitDice = prepareHitDice(this.parent).reduce(
        (acc, { die, total }) => {
          if (total > 0) acc.push(die);
          return acc;
        },
        []
      );
      hitDiceData.selected = Object.fromEntries(
        availableHitDice.map((hd, idx) => [hd, idx === 0 ? 1 : 0])
      );
      hitDiceData.default = hitDiceConsumer.default;
    }

    // Prepare the default item uses data.
    const itemUsesData = {};
    const itemConsumer = this.#getConsumerFromPreparedConsumers(consumers, 'itemUses');
    if (!foundry.utils.isEmpty(itemConsumer)) {
      itemUsesData.quantity = itemConsumer?.quantity ?? 1;
      itemUsesData.baseUses = itemConsumer?.quantity ?? 1;
    }

    // Prepare the default action uses data.
    const spellData = {};
    const spellConsumer = Object.values(consumers.spell ?? {})?.[0]?.[1] ?? {};
    if (!foundry.utils.isEmpty(spellConsumer)) {
      const mode = spellConsumer.mode ?? 'variable';
      const availableSpellSlots = Object.entries(this.parent?.system?.spellResources?.slots ?? {})
        .reduce(
          (acc, [level, slot]) => {
            if (slot.max > 0 && slot.current > 0) acc.push(level);
            return acc;
          },
          []
        );

      const spellLevel = spellConsumer.spellLevel ?? this.system?.level ?? 1;
      const spellPoints = spellConsumer.points ?? CONFIG.A5E.spellLevelCost[spellLevel] ?? 1;
      spellData.level = spellLevel;
      spellData.points = spellPoints;
      spellData.basePoints = spellLevel;
      spellData.baseLevel = spellPoints;
      // eslint-disable-next-line no-nested-ternary
      spellData.consume = mode === 'pointsOnly'
        ? 'spellPoint'
        : availableSpellSlots.length > 0
          ? 'spellSlot'
          : 'spellPoint';
    }

    return {
      actionUses: actionUsesData,
      hitDice: hitDiceData,
      itemUses: itemUsesData,
      spell: spellData
    };
  }

  #getDefaultBonuses(actor, rolls) {
    const damageBonuses = prepareDamageBonuses(actor, rolls);
    const healingBonuses = prepareHealingBonuses(actor, rolls);

    const defaultDamageBonuses = damageBonuses.reduce((acc, [, bonus]) => {
      if (bonus.default ?? true) acc.push(bonus);
      return acc;
    }, []);

    const defaultHealingBonuses = healingBonuses.reduce((acc, [, bonus]) => {
      if (bonus.default ?? true) acc.push(bonus);
      return acc;
    }, []);

    return { damageBonuses: defaultDamageBonuses, healingBonuses: defaultHealingBonuses };
  }

  #getDefaultPrompts(prompts) {
    const promptsByType = preparePrompts(prompts, this);

    return Object.entries(promptsByType).reduce((defaultPrompts, [promptType, promptGroup]) => {
      defaultPrompts.push(...promptGroup.reduce((acc, [, prompt]) => {
        if (promptType === 'savingThrow') prompt.dc = computeSaveDC(this.actor, prompt.saveDC);

        if (prompt.default ?? true) acc.push(prompt);

        return acc;
      }, []));

      return defaultPrompts;
    }, []);
  }

  #getDefaultRollData(rolls) {
    return Object.entries(rolls).reduce((defaultRolls, [rollType, rollGroup]) => {
      if (rollType === 'attack') return defaultRolls;

      defaultRolls.push(...rollGroup.reduce((acc, [, roll]) => {
        if (roll.default ?? true) acc.push(roll);
        return acc;
      }, []));

      return defaultRolls;
    }, []);
  }

  #getConsumerFromPreparedConsumers(consumers, type) {
    if (foundry.utils.isEmpty(consumers?.[type])) return null;
    const [, consumer] = Object.values(consumers[type]);
    return consumer;
  }

  async configureItem() {
    await this.sheet.render(true);
  }

  async duplicateItem() {
    const owningActor = this.actor;
    const newItem = foundry.utils.duplicate(this);
    newItem.name = `${newItem.name} (Copy)`;

    if (owningActor) owningActor.createEmbeddedDocuments('Item', [newItem]);
    else Item.createDocuments([newItem]);
  }

  async toggleAttunement() {
    if (!this.type === 'object') return;

    await this.update({
      'system.attuned': !this.system.attuned
    });
  }

  async toggleDamagedState() {
    if (!this.type === 'object') return;

    const currentState = this.system.damagedState;
    const newState = (currentState + 1) % 3;

    await this.update({
      'system.damagedState': newState
    });
  }

  async toggleEquippedState() {
    if (!this.type === 'object' || !this.actor) return;

    const currentState = this.system.equippedState;
    let newState = (currentState + 1) % 3;

    // Check if armor is already equipped
    if (newState === CONFIG.A5E.EQUIPPED_STATES.EQUIPPED && this.system.objectType === 'armor') {
      const { hasArmor, hasUnderArmor } = this.parent.items.reduce((acc, item) => {
        if (item.system.equippedState !== CONFIG.A5E.EQUIPPED_STATES.EQUIPPED
          || item.system.objectType !== 'armor') return acc;
        const isUnderarmor = item.system.materialProperties.includes('underarmor');
        if (isUnderarmor) acc.hasUnderArmor = true;
        else acc.hasArmor = true;
        return acc;
      }, { hasArmor: false, hasUnderArmor: false });

      const isUnderarmor = this.system.materialProperties.includes('underarmor');
      if (isUnderarmor && hasUnderArmor) newState = 0;
      else if (!isUnderarmor && hasArmor) newState = 0;

      // Warn user
      if (newState === 0) {
        ui.notifications.warn(game.i18n.localize('A5E.armorClass.armorAlreadyEquipped'));
      }
    }

    // Check if 2 shields are already equipped
    if (newState === 2 && this.system.objectType === 'shield') {
      const shields = this.parent.items.filter((i) => (
        i.system.equippedState === CONFIG.A5E.EQUIPPED_STATES.EQUIPPED
        && i.system.objectType === 'shield'));
      if (shields.length >= 2) newState = 0;
      if (newState === 0) {
        ui.notifications.warn(game.i18n.localize('A5E.armorClass.shieldAlreadyEquipped'));
      }
    }

    await this.update({
      'system.equippedState': newState
    });
  }

  async toggleFavorite() {
    if (!this.actor) return;

    await this.update({
      'system.favorite': !this.system.favorite
    });
  }

  async togglePrepared() {
    if (!this.type === 'spell' || !this.actor) return;

    await this.update({
      'system.prepared': !this.system.prepared
    });
  }

  async toggleUnidentified() {
    if (!this.type === 'object') return;

    await this.update({
      'system.unidentified': !this.system.unidentified
    });
  }

  async updateContainer(containerUuid) {
    if (this.type !== 'object') return;

    if (!containerUuid) {
      const container = await fromUuid(this.system.containerId);
      if (!container) return;

      await this.update({ 'system.containerId': '' });
      await container.containerItems.delete(this.uuid);
    }

    const container = await fromUuid(containerUuid);
    if (!container
      || container?.type !== 'object'
      || container?.system?.objectType !== 'container'
      || container?.parent?.id !== this.parent?.id) return;

    await this.update({ 'system.containerId': containerUuid });
    await container.containerItems.add(this.uuid);
  }

  async recharge(actionId, state = false) {
    if (state || !this.actor) return;
    let max = getDeterministicBonus(this.system.uses.max, this.actor.getRollData());
    let current = this.system.uses.value;
    let formula = this.system.uses.recharge.formula || '1d6';
    let threshold = this.system.uses.recharge.threshold ?? 6;
    let updatePath = 'system.uses.value';

    if (actionId) {
      const action = this.actions[actionId];

      max = getDeterministicBonus(action.uses?.max ?? '', this.actor.getRollData());
      current = action.uses?.value ?? 0;
      formula = action.uses?.recharge?.formula || '1d6';
      threshold = action.uses?.recharge?.threshold ?? 6;
      updatePath = `system.actions.${actionId}.uses.value`;
    }

    // Roll
    const roll = await new Roll(formula, this.actor.getRollData()).evaluate({ async: true });

    // TODO: Make the message prettier
    roll.toMessage();

    if (roll.total >= threshold) await this.update({ [updatePath]: Math.min(max, current + 1) });
  }

  /** @inheritdoc */
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);

    // Add schema version
    if (!this.system.schema.version) {
      let version = null;
      if (typeof this.system?.equipped === 'boolean') version = 0.003;
      else if (typeof this.system?.recharge === 'string') version = 0.002;
      else if (typeof this.system?.uses?.max === 'string') version = 0.001;
      else if (this.system?.actionOptions) version = null;
      else version = MigrationRunnerBase.LATEST_SCHEMA_VERSION;

      this.updateSource({
        'system.schema.version': version
      });
    }
  }

  async _onCreate(data, options, user) {
    super._onCreate(data, options, user);

    // Update effect origins
    const effects = this.effects.contents;
    const updateArr = effects.map((effect) => ({ _id: effect._id, origin: this.uuid }));

    this.updateEmbeddedDocuments('ActiveEffect', updateArr);
  }

  async _onDelete(data, options, user) {
    super._onDelete(data, options, user);

    // Clean up container
    if (!this.parent) return;
    if (this.type === 'object') {
      if (this.system.objectType === 'container') {
        // eslint-disable-next-line no-undef
        const items = Object.values(this.system.items).map(({ uuid }) => fromUuidSync(uuid));
        const updates = items.map((i) => ({ _id: i.id, 'system.containerId': '' }));
        await this.parent?.updateEmbeddedDocuments('Item', updates);
      }

      const container = await fromUuid(this.system.containerId);
      if (container) await container?.containerItems?.delete(this.uuid);
    }
  }

  static async _onCreateDocuments(items, context) {
    if (!(context.parent instanceof Actor)) return undefined;
    const toCreate = [];
    items.forEach((item) => {
      item.effects.forEach((effect) => {
        const isPassive = effect.flags?.a5e?.transferType === 'passive';
        if (!isPassive) return;

        const effectData = effect.toJSON();
        effectData.origin = item.uuid;
        toCreate.push(effectData);
      });
    });

    if (!toCreate.length) return [];
    const cls = getDocumentClass('ActiveEffect');
    return cls.createDocuments(toCreate, context);
  }
}
