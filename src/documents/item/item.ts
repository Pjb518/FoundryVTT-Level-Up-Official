/* eslint-disable no-continue */
/* eslint-disable no-unused-vars */
import type { Action } from 'types/action';
import type { ActionActivationOptions } from './data';

import { BaseItemA5e } from './base';

import computeSaveDC from '../../utils/computeSaveDC';
import getAttackAbility from '../../utils/getAttackAbility';
import getDeterministicBonus from '../../dice/getDeterministicBonus';
import getRollFormula from '../../utils/getRollFormula';
import prepareConsumers from '../../apps/dataPreparationHelpers/itemActivationConsumers/prepareConsumers';
import prepareHitDice from '../../apps/dataPreparationHelpers/prepareHitDice';
import preparePrompts from '../../apps/dataPreparationHelpers/itemActivationPrompts/preparePrompts';
import prepareRolls from '../../apps/dataPreparationHelpers/itemActivationRolls/prepareRolls';

import ActionActivationDialog from '../../apps/dialogs/initializers/ActionActivationDialog';
import ActionSelectionDialog from '../../apps/dialogs/initializers/ActionSelectionDialog';

import { ActionsManager } from '../../managers/ActionsManager';
import { ResourceConsumptionManager } from '../../managers/ResourceConsumptionManager';
import { RollPreparationManager } from '../../managers/RollPreparationManager';
import TemplatePreparationManager from '../../managers/TemplatePreparationManager';

import getSummaryData from '../../utils/summaries/getSummaryData';

// *****************************************************************************************

type SystemItemTypes = Exclude<
  foundry.documents.BaseItem.TypeNames,
  'base' | 'archetype' | 'background' | 'class' | 'culture' | 'destiny' | 'heritage'
>;

interface ItemA5e<ItemType extends SystemItemTypes = SystemItemTypes> {
  type: ItemType,
  system: DataModelConfig['Item'][ItemType],
}

// *****************************************************************************************

/**
 * Override and extend the basic Item implementation.
 * @extends {Item}
 */
class ItemA5e extends BaseItemA5e {
  declare actions: ActionsManager;

  // *****************************************************************************************

  override prepareBaseData() {
    // Set up managers TODO: Null these in initialize
    this.actions = new ActionsManager(this);
  }

  override prepareDerivedData() {
    super.prepareDerivedData();
    if (['object', 'feature'].includes(this.type)) this.prepareArmorData();
  }

  prepareArmorData() {
    const itemData = this.system;

    // Calculate AC formula
    // @ts-expect-error
    const { baseFormula, maxDex } = itemData.ac ?? {};
    if (!baseFormula) return;

    let formula = baseFormula;
    if (maxDex && maxDex > 0) {
      formula = baseFormula
        .replaceAll(/@dex\.mod|@abilities\.dex\.mod/gm, `min(@dex.mod, ${maxDex})`);
    }

    // @ts-expect-error
    if (itemData?.damagedState === CONFIG.A5E.DAMAGED_STATES.BROKEN) {
      // @ts-expect-error
      if (itemData.objectType === 'armor') {
        formula = `10 + max(floor((${formula} - 10) / 2), 1)`;
      } else formula = `max(floor((${formula}) / 2), 1)`;
    }

    foundry.utils.setProperty(this, 'system.ac.formula', formula);
  }

  // *****************************************************************************************

  /**
   * A handler for activating an item. An actionId can be passed to this method to use a specific
   * action defined on the item. If there are no actions defined, this method defaults to
   * outputting the item's description.
   *
  //  * This method accepts an options object to further customize the activation process.
   *
   * @param actionId - The action id
   * @param options
   * @returns
   */
  override async activate(actionId: string | null, options: ActionActivationOptions = {}) {
    // Do not allow an item to activate if it not attached to an actor or if the user does
    // not have owner permissions for the actor.
    if (!this.actor || !this?.actor.isOwner) return;

    if (this.actions.count === 0) {
      // If no actions are defined, default to outputting just the item description.
      this.shareItemDescription();
    } else if (this.actions.count === 1) {
      // If there is a single defined action, use that action.
      this.#activateAction(this.actions.first!.id, options);
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

  // TODO: Find out where this is being used.
  async showActionActivationDialog(actionId: string, action?: Action) {
    if (
      !foundry.utils.isEmpty(action?.rolls)
      || !foundry.utils.isEmpty(action?.prompts)
    ) { return true; }

    // Check if consumers need a dialog
    const consumerTypes = new Set(
      Object.values(action?.consumers ?? {}).map((c) => c.type)
    ) as Set<string>;

    if (consumerTypes.intersects(CONFIG.A5E.configurableConsumers)) {
      return true;
    }

    return false;
  }

  async #activateAction(actionId: string, options: ActionActivationOptions = {}) {
    let activationData;
    const action = this.actions.get(actionId)!;

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
      author: game.user?.id,
      flavor: action.name ? `${this.name}: ${action.name}` : this.name,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      style: CONST.CHAT_MESSAGE_STYLES.OTHER,
      sound: CONFIG.sounds.dice,
      rolls: rolls.map(({ roll }) => roll),
      rollMode: activationData.visibilityMode ?? game.settings.get('core', 'rollMode'),
      flags: {
        a5e: {
          actorId: this.actor?.uuid,
          itemId: this.uuid,
          cardType: 'item',
          // @ts-expect-error
          castingLevel: activationData.consumers?.spell?.level ?? this.system.level ?? null,
          img: action.img ?? this.img ?? 'icons/svg/item-bag.svg',
          name: this.name,
          actionName: action.name,
          actionDescription: action?.descriptionOutputs?.includes('action')
            ? await TextEditor.enrichHTML(action.description, {
              secrets: this.isOwner,
              relativeTo: this,
              rollData: this?.actor?.getRollData(this) ?? {}
            })
            : null,
          itemDescription: action?.descriptionOutputs?.includes('item') ?? true
            ? await TextEditor.enrichHTML(this.system.description, {
              secrets: this.isOwner,
              relativeTo: this,
              rollData: this?.actor?.getRollData(this) ?? {}
            })
            : null,
          unidentifiedDescription: action?.descriptionOutputs?.includes('item') ?? true
            // @ts-expect-error
            ? await TextEditor.enrichHTML(this.system.unidentifiedDescription, {
              secrets: this.isOwner,
              relativeTo: this,
              rollData: this?.actor?.getRollData(this) ?? {}
            })
            : null,
          prompts: activationData.prompts,
          rollData: rolls.map(({ roll, ...rollData }) => rollData),
          summaryData: getSummaryData(this, action, {
            hideAttunementData: true,
            hideCraftingComponents: true,
            hidePrice: true,
            hideRarity: true,
            hideSpellClasses: true,
            hideSpellComponents: true,
            hideSpellLevel: true
          })
        }
      },
      content: '<article></article>'
    };

    ChatMessage.applyRollMode(chatData, activationData.visibilityMode ?? game.settings.get('core', 'rollMode'));
    const chatCard = await ChatMessage.create(chatData);

    // Apply onUse effects to self
    const effects = activationData.prompts.reduce((acc, { type, effectId }) => {
      if (type === 'effect') {
        const effect = this.effects.get(effectId);
        if (!effect) return acc;
        // @ts-expect-error
        if (!effect.flags?.a5e?.applyToSelf) return acc;
        acc.push(effect);
      }

      return acc;
    }, []);

    effects.forEach((effect) => effect.transferEffect(this.actor));

    Hooks.callAll('a5e.itemActivate', this, {
      actionId, action, dialog: activationData, options, rolls, validTemplate
    });

    return chatCard;
  }

  async #showActionActivationPrompt(actionId: string, options: ActionActivationOptions) {
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
    const placeTemplate = game.settings.get('a5e', 'placeItemTemplateDefault')
      || action?.area?.placeTemplate
      || false;

    return {
      attack,
      consumers,
      damageBonuses,
      healingBonuses,
      placeTemplate,
      prompts,
      rolls: otherRolls
    };
  }

  #getDefaultAttackRollData(attack, options) {
    if (!attack) return {};

    const { actor } = this;
    if (!actor) return {};

    const attackRoll = attack[0][1];
    const attackAbility = getAttackAbility(actor, this, attackRoll);

    const expertiseDie = actor.RollOverrideManager?.getExpertiseDice(
      `attackTypes.${attackRoll.attackType}`,
      options.expertiseDie ?? 0
    );

    const rollMode = actor.RollOverrideManager?.getRollOverride(
      `attackTypes.${attackRoll.attackType}`,
      options.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL
    );

    const formula = getRollFormula(actor, {
      ability: attackAbility,
      attackBonus: attackRoll?.bonus,
      attackType: attackRoll?.attackType,
      expertiseDie,
      item: this,
      proficient: attackRoll?.proficient ?? true,
      rollMode,
      situationalMods: options.situationalMods,
      selectedAttackBonuses: this.parent?.BonusesManager?.getDefaultSelections(
        'attacks',
        // @ts-expect-error
        { item: this, attackType: attackRoll?.attackType }
      ),
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
    const actor = this.parent;
    if (!actor) {
      return {
        actionUses: {}, hitDice: {}, itemUses: {}, spell: {}
      };
    }

    // Prepare the default action uses data.
    const actionUsesData: Record<string, any> = {};
    const actionConsumer: any = this.#getConsumerFromPreparedConsumers(consumers, 'actionUses');
    if (!foundry.utils.isEmpty(actionConsumer)) {
      actionUsesData.quantity = actionConsumer?.quantity ?? 1;
      actionUsesData.baseUses = actionConsumer?.quantity ?? 1;
    }

    // Prepare the default hit-dice data.
    const hitDiceData: Record<string, any> = {};
    const hitDiceConsumer: any = this.#getConsumerFromPreparedConsumers(consumers, 'hitDice');
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
    const itemUsesData: Record<string, any> = {};
    const itemConsumer: any = this.#getConsumerFromPreparedConsumers(consumers, 'itemUses');
    if (!foundry.utils.isEmpty(itemConsumer)) {
      itemUsesData.quantity = itemConsumer?.quantity ?? 1;
      itemUsesData.baseUses = itemConsumer?.quantity ?? 1;
    }

    // Prepare the default action uses data.
    const spellData: Record<string, any> = {};
    const spellConsumer: any = Object.values(consumers.spell ?? {})?.[0]?.[1] ?? {};
    if (!foundry.utils.isEmpty(spellConsumer)) {
      const mode = spellConsumer.mode ?? 'variable';
      const availableCharges = actor.system.spellResources?.artifactCharges?.current ?? 0;
      const availablePoints = actor.system.spellResources?.points?.current ?? 0;
      const availableSpellSlots = Object.entries(actor.system.spellResources?.slots ?? {})
        .reduce(
          (acc, [level, slot]) => {
            // @ts-expect-error
            if (slot.max > 0 && slot.current > 0) acc.push(level);
            return acc;
          },
          []
        );

      if (mode === 'chargesOnly') spellData.consume = 'artifactCharge';
      else if (mode === 'pointsOnly') spellData.consume = 'spellPoint';
      else if (mode === 'slotsOnly') spellData.consume = 'spellSlot';
      else if (availableCharges > 0) spellData.consume = 'artifactCharge';
      else if (availablePoints > 0) spellData.consume = 'spellPoint';
      else if (availableSpellSlots.length > 0) spellData.consume = 'spellSlot';
      else spellData.consume = 'spellPoint';

      // @ts-expect-error
      if (this.system?.level === null || this.system?.level === undefined) {
        spellData.consume = 'noConsume';
      }

      // @ts-expect-error
      const defaultLevel = spellConsumer.spellLevel ?? this.system?.level ?? 1;
      const smallestAvailable = Math.min(...availableSpellSlots.map(Number));
      const spellLevel = spellData.consume === 'spellSlot'
        ? Math.max(defaultLevel, smallestAvailable)
        : defaultLevel;
      const spellPoints = spellConsumer.points ?? CONFIG.A5E.spellLevelCost[spellLevel] ?? 1;

      spellData.baseCharges = spellLevel;
      spellData.baseLevel = spellLevel;
      spellData.basePoints = spellPoints;
      spellData.charges = spellLevel;
      spellData.points = spellPoints;
      spellData.level = spellLevel;

      // @ts-expect-error
      const spellBook = this.parent?.spellBooks?.get(this.system.spellBook);
      if (spellBook?.disableSpellConsumers) spellData.consume = 'noConsume';
    }

    return {
      actionUses: actionUsesData,
      hitDice: hitDiceData,
      itemUses: itemUsesData,
      spell: spellData
    };
  }

  #getDefaultBonuses(actor, rolls) {
    const damageBonuses = actor.BonusesManager.prepareGlobalDamageBonuses(this, rolls);
    const healingBonuses = actor.BonusesManager.prepareGlobalHealingBonuses(this, rolls);

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
      // @ts-expect-error
      defaultPrompts.push(...promptGroup.reduce((acc, [, prompt]) => {
        // @ts-expect-error
        if (promptType === 'savingThrow') prompt.dc = computeSaveDC(this.actor, this, prompt.saveDC);

        if (prompt.default ?? true) acc.push(prompt);

        return acc;
      }, []));

      return defaultPrompts;
    }, []);
  }

  #getDefaultRollData(rolls) {
    return Object.entries(rolls).reduce((defaultRolls, [rollType, rollGroup]) => {
      if (rollType === 'attack') return defaultRolls;

      // @ts-expect-error
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

  async recharge(actionId, state = false) {
    if (state || !this.actor) return;
    let max = getDeterministicBonus(this.system.uses.max, this.actor.getRollData(this)) ?? 0;
    let current = this.system.uses.value;
    let formula = this.system.uses.recharge.formula || '1d6';
    let threshold = this.system.uses.recharge.threshold ?? 6;
    // @ts-expect-error
    let rechargeType = this.system.uses.recharge?.rechargeType || 'custom';
    // @ts-expect-error
    let rechargeAmount = this.system.uses.recharge?.rechargeAmount || '1';
    let updatePath = 'system.uses.value';

    if (actionId) {
      const action = this.actions[actionId];

      max = getDeterministicBonus(action.uses?.max ?? '', this.actor.getRollData(this)) ?? 0;
      current = action.uses?.value ?? 0;
      formula = action.uses?.recharge?.formula || '1d6';
      threshold = action.uses?.recharge?.threshold ?? 6;
      rechargeType = action.uses?.recharge?.rechargeType || 'custom';
      rechargeAmount = action.uses?.recharge?.rechargeAmount || '1';
      updatePath = `system.actions.${actionId}.uses.value`;
    }

    // Recharge Roll
    const rechargeRoll = await new Roll(formula, this.actor.getRollData(this))
      .evaluate();

    // TODO: Chat Cards - Make the message prettier
    rechargeRoll.toMessage();

    if (rechargeRoll.total < threshold) return;

    if (rechargeType === 'min') await this.update({ [updatePath]: 0 });
    else if (rechargeType === 'max') await this.update({ [updatePath]: max });
    else {
      const rechargeAmountRoll = await new Roll(
        rechargeAmount,
        this.actor.getRollData(this)
      ).evaluate();

      // TODO: Add the roll back in when the custom recharge amount config is added.
      // rechargeAmountRoll.toMessage();

      await this.update({ [updatePath]: Math.min(max, current + rechargeAmountRoll.total) });
    }
  }

  /** @inheritdoc */
  override async _preCreate(data, options, user): Promise<boolean | void> {
    await super._preCreate(data, options, user);
  }

  override async _preUpdate(data, options, user) {
    super._preUpdate(data, options, user);
  }

  override _onCreate(data, options, userId) {
    super._onCreate(data, options, userId);
  }

  override _onDelete(options, user) {
    super._onDelete(options, user);
  }
}

export { ItemA5e };
