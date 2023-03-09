import ActionsManager from '../managers/ActionsManager';

import getChatCardTargets from '../utils/getChatCardTargets';
import getDeterministicBonus from '../dice/getDeterministicBonus';
import ItemMeasuredTemplate from '../pixi/ItemMeasuredTemplate';
import createTemplateDocument from '../utils/templates/createTemplateDocument';

import ActionActivationDialog from '../apps/dialogs/initializers/ActionActivationDialog';
import ActionSelectionDialog from '../apps/dialogs/initializers/ActionSelectionDialog';

/**
 * Override and extend the basic Item implementation.
 * @extends {Item}
 */
export default class ItemA5e extends Item {
  static chatListeners(html) {
    html.find('.a5e-js-chat-ability-check-button').click(this._onClickChatAbilityCheckButton.bind(this));
    html.find('.a5e-js-chat-saving-throw-button').click(this._onClickChatSavingThrowButton.bind(this));
    html.find('.a5e-js-toggle-roll-tooltip-visibility').click(this._onToggleRollTooltipVisibility.bind(this));
  }

  get abilityMod() {
    const itemData = this.system;

    if (!itemData.ability) return null;

    if (itemData.ability === 'spellcasting') {
      return this.actor ? this.actor.system.attributes.spellcasting : 'int';
    }

    if (itemData.ability === 'default') {
      if (this.type === 'object' && itemData.objectType === 'weapon') {
        if (itemData.actionOptions.includes('attack') && itemData.attack.type === 'rangedWeaponAttack') {
          return 'dex';
        }

        if (this.actor && itemData.weaponProperties.includes('finesse')) {
          const { str, dex } = this.actor.system.abilities;

          return dex.value > str.value ? 'dex' : 'str';
        }
      }

      if (this.type === 'spell') {
        return this.actor ? this.actor.system.attributes.spellcasting : 'int';
      }

      return 'str';
    }

    return itemData.ability || 'str';
  }

  get hasValidTemplateDefinition() {
    const { area } = this.system;

    if (!area.shape) return false;

    if (area.shape === 'line' || area.shape === 'cone') return !!area.length;
    if (area.shape === 'sphere' || area.shape === 'cylinder') return !!area.radius;
    if (area.shape === 'cube') return !!area.width;

    return false;
  }

  get actions() {
    return new ActionsManager(this);
  }

  // *****************************************************************************************

  /**
   * A handler for acivating an item. An actionId can be passed to this method to use a specific
   * action defined on the item. If there are no actions defined, this method defaults to
   * outputting the item's description.
   *
   * This method accepts an options object to further customise the activation process.
   *
   * @param {string} actionId
   * @param {object options
   * @returns
   */
  async activate(actionId, options = {}) {
    // Do not allow an item to activate if it not attached to an actor.
    if (!this.actor) return;

    if (this.actions.count === 0) {
      // If no actions are defined, default to outputting just the item description.
      this.shareItemDescription();
    } else if (this.actions.count === 1) {
      // If there is a single defined action, use that action.
      this.#activateAction(this.actions.keys()[0]);
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

      this.#activateAction(promise.actionId);
    }
  }

  async #activateAction(actionId, options) {
    const dialog = new ActionActivationDialog({
      actionId,
      options,
      actorDocument: this.actor,
      itemDocument: this
    });

    dialog.render(true);

    const promise = await dialog.promise;

    if (!promise?.actionId) return;
  }

  async shareItemDescription() {
    const chatData = {
      user: game.user?.id,
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flags: {
        a5e: {
          actorId: this.actor.uuid,
          cardType: 'item',
          description: this.system.description,
          img: this.img,
          name: this.name
        }
      },
      content: '<article></article>'
    };

    ChatMessage.create(chatData);
  }

  // FIXME: Needs complete refactor
  // async activate(options = {}) {
  //   const itemData = this.system;
  //   const rollData = this.actor.getRollData();
  //   let attack;
  //   let damage;
  //   let healing;
  //   let placeTemplate;

  //   const dialogTitle = game.i18n.format(
  //     'A5E.ItemActivationPrompt',
  //     { name: this.actor.name, itemName: this.name }
  //   );

  //   // const dialog = new ReactiveDialog(ItemActivationDialog, {
  //   //   title: dialogTitle, props: { actor: this.actor, item: this, rollMode: options.rollMode }
  //   // });

  //   const data = {
  //     id: this.id,
  //     img: this.img,
  //     title: this.name,
  //     description: itemData.description,
  //     actionOptions: itemData.actionOptions,
  //     isCrit: null,
  //     isFumble: null,
  //     attack: null,
  //     damage: null,
  //     healing: null,
  //     abilityCheck: {
  //       ...itemData.check,
  //       label: game.i18n.format(
  //         'A5E.RollPromptAbilityCheck',
  //         { ability: game.i18n.localize(CONFIG.A5E.abilities[itemData.check.ability]) }
  //       )
  //     },
  //     savingThrow: {
  //       dc: getDeterministicBonus(itemData.save.dc, rollData),
  //       label: game.i18n.format(
  //         'A5E.RollPromptSavingThrow',
  //         { ability: game.i18n.localize(CONFIG.A5E.abilities[itemData.save.targetAbility]) }
  //       ),
  //       targetAbility: itemData.save.targetAbility
  //     }
  //   };

  //   if (
  //     ['attack', 'damage', 'healing'].some((option) => itemData.actionOptions.includes(option))
  //     || this.hasValidTemplateDefinition
  //   ) {
  //     // await dialog.render(true);

  //     // try {
  //     //   const configuration = await dialog.promise;
  //     //   attack = configuration.attack;
  //     //   damage = configuration.damage;
  //     //   healing = configuration.healing;
  //     //   placeTemplate = configuration.placeTemplate;
  //     // } catch {
  //     //   return;
  //     // }
  //   }

  //   if (itemData.actionOptions.includes('attack')) {
  //     const roll = new CONFIG.Dice.D20Roll(attack.formula, rollData);
  //     await roll.evaluate({ async: true });

  //     data.isCrit = roll.dice[0].total >= itemData.attack.critThreshold;
  //     data.isFumble = roll.dice[0].total === 1;

  //     const tooltip = await roll.getTooltip();

  //     data.attack = {
  //       roll,
  //       tooltip
  //     };
  //   }

  //   if (itemData.actionOptions.includes('damage')) {
  //     data.damage = [];

  //     // TODO: Refactor this to stop eslint complaining
  //     for (const { canCrit, damageType, formula } of damage) {
  //       const roll = new CONFIG.Dice.DamageRoll(
  //         formula || '0',
  //         rollData,
  //         { canCrit, isCrit: data.isCrit }
  //       );

  //       await roll.evaluate({ async: true });
  //       const tooltip = await roll.getTooltip();

  //       data.damage.push({
  //         damageType, roll, tooltip
  //       });
  //     }
  //   }

  //   if (itemData.actionOptions.includes('healing')) {
  //     data.healing = [];

  //     // TODO: Refactor this to stop eslint complaining
  //     for (const { healingType, formula } of healing) {
  //       const roll = new CONFIG.Dice.DamageRoll(
  //         formula || '0',
  //         rollData,
  //         { canCrit: false }
  //       );

  //       await roll.evaluate({ async: true });
  //       const tooltip = await roll.getTooltip();

  //       data.healing.push({
  //         healingType, roll, tooltip
  //       });
  //     }
  //   }

  //   // Place template if allowed
  //   if (placeTemplate) {
  //     const templateDocument = createTemplateDocument(this);
  //     const template = new ItemMeasuredTemplate(templateDocument);

  //     template.item = this;
  //     template.actorSheet = this.actor?.sheet || null;

  //     Hooks.call('a5e.preItemTemplateCreate', templateDocument, template);

  //     if (template) template.drawPreview();
  //   }

  //   this.actor.constructItemCard(data);
  // }

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

  static async _onClickChatAbilityCheckButton(event) {
    /* eslint-disable no-await-in-loop, no-restricted-syntax */
    event.preventDefault();

    const { ability } = event.currentTarget.dataset;
    const targets = getChatCardTargets();

    for (const token of targets) {
      await token.actor.rollAbilityCheck(ability);
    }
  }

  static async _onClickChatSavingThrowButton(event) {
    event.preventDefault();

    const { ability } = event.currentTarget.dataset;
    const targets = getChatCardTargets();

    for (const token of targets) {
      await token.actor.rollSavingThrow(ability);
    }
  }

  static _onToggleRollTooltipVisibility(event) {
    event.preventDefault();

    const tooltip = Array.from($(event.currentTarget).siblings('.a5e-dice-tooltip'))[0];
    $(tooltip).slideToggle();
  }
}
