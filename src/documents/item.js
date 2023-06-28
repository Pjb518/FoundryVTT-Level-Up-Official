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
import ResourceConsumptionManager from '../managers/ResourceConsumptionManager';
import RollPreparationManager from '../managers/RollPreparationManager';
import TemplatePreparationManager from '../managers/TemplatePreparationManager';

/**
 * Override and extend the basic Item implementation.
 * @extends {Item}
 */
export default class ItemA5e extends Item {
  get actions() {
    return new ActionsManager(this);
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

    const rollPreparationManager = new RollPreparationManager(
      this.actor,
      this,
      activationData.consumers ?? {},
      activationData.damageBonuses ?? {},
      activationData.healingBonuses ?? {},
      activationData.rolls ?? {}
    );

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
      flags: {
        a5e: {
          actorId: this.actor.uuid,
          itemId: this.uuid,
          cardType: 'item',
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

  async toggleBroken() {
    if (!this.type === 'object') return;

    await this.update({
      'system.broken': !this.system.broken
    });
  }

  async toggleEquipped() {
    if (!this.type === 'object' || !this.actor) return;

    await this.update({
      'system.equipped': !this.system.equipped
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

  async _onCreate(data, options, user) {
    super._onCreate(data, options, user);

    // Update effect origins
    const effects = this.effects.contents;
    const updateArr = effects.map((effect) => ({ _id: effect._id, origin: this.uuid }));

    this.updateEmbeddedDocuments('ActiveEffect', updateArr);
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
