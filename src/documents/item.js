/* eslint-disable no-unused-vars */
// eslint-disable-next-line import/no-unresolved
import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';
import constructD20RollFormula from '../dice/constructD20RollFormula';
import getAttackAbility from '../utils/getAttackAbility';
import getDeterministicBonus from '../dice/getDeterministicBonus';
import getExpertiseDieSize from '../utils/getExpertiseDieSize';
import overrideRollMode from '../utils/overrideRollMode';
import overrideExpertiseDie from '../utils/overrideExpertiseDie';
import prepareConsumers from '../apps/dataPreparationHelpers/itemActivationConsumers/prepareConsumers';
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
      activationData.rolls ?? {}
    );

    const rolls = await rollPreparationManager.prepareRolls();

    const templateManager = new TemplatePreparationManager(
      this.actor,
      this,
      action,
      activationData.consumers
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
            ? TextEditor.enrichHTML(action.description, {
              async: false
            })
            : null,
          itemDescription: action?.descriptionOutputs?.includes('item') ?? true
            ? TextEditor.enrichHTML(this.system.description, {
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
            ? TextEditor.enrichHTML(action.description, {
              async: false
            })
            : null,
          itemDescription: action?.descriptionOutputs?.includes('item') ?? true
            ? TextEditor.enrichHTML(this.system.description, {
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
    // const consumers = prepareConsumers(action.consumers);

    const attack = this.#getDefaultAttackRollData(rolls.attack, options);
    // const consumerData = this.#getDefaultConsumerData(consumers);

    return {
      attack,
      prompts: [],
      rolls: []
    };
  }

  #getDefaultAttackRollData(attack, options) {
    const { actor } = this;
    const { abilities } = CONFIG.A5E;
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

    const formula = constructD20RollFormula({
      actor,
      rollMode,
      modifiers: [
        {
          label: localize('A5E.ProficiencyBonusAbbr'),
          value:
            (attackRoll?.proficient ?? true)
            && actor.system.attributes.prof
        },
        {
          label: localize('A5E.AbilityCheckMod', {
            ability: localize(
              abilities[attackAbility] ?? attackAbility
            )
          }),
          value: actor.system.abilities[attackAbility ?? '']?.mod
        },
        {
          label: localize('A5E.AttackBonus'),
          value: attackRoll?.bonus ?? 0
        },
        {
          label: localize('A5E.ExpertiseDie'),
          value: getExpertiseDieSize(expertiseDie)
        },
        {
          label: localize('A5E.BonusMeleeWeaponAttack'),
          value:
            attackRoll?.attackType === 'meleeWeaponAttack'
            && actor.system.bonuses.meleeWeaponAttack
        },
        {
          label: localize('A5E.BonusRangedWeaponAttack'),
          value:
            attackRoll?.attackType === 'rangedWeaponAttack'
            && actor.system.bonuses.rangedWeaponAttack
        },
        {
          label: localize('A5E.BonusMeleeSpellAttack'),
          value:
            attackRoll?.attackType === 'meleeSpellAttack'
            && actor.system.bonuses.meleeSpellAttack
        },
        {
          label: localize('A5E.BonusRangedSpellAttack'),
          value:
            attackRoll?.attackType === 'rangedSpellAttack'
            && actor.system.bonuses.rangedSpellAttack
        },
        {
          value: options.situationalMods
        }
      ]
    }).rollFormula;

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
}
