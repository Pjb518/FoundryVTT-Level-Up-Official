import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';

import ActionsManager from '../managers/ActionsManager';

import constructRollFormula from '../dice/constructRollFormula';
import constructD20RollFormula from '../dice/constructD20RollFormula';
import createTemplateDocument from '../utils/measuredTemplates/createTemplateDocument';
import getChatCardTargets from '../utils/getChatCardTargets';
import validateTemplateData from '../utils/measuredTemplates/validateTemplateData';

import ActionActivationDialog from '../apps/dialogs/initializers/ActionActivationDialog';
import ActionSelectionDialog from '../apps/dialogs/initializers/ActionSelectionDialog';
import D20Roll from '../dice/d20Roll';
import ItemMeasuredTemplate from '../pixi/ItemMeasuredTemplate';

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

    if (!promise) return;

    promise.rolls ??= [];
    promise.rolls.push(promise?.attack ?? {});

    const rolls = await this.#prepareItemRolls(promise.rolls);

    if (promise.placeTemplate) {
      const validTemplate = validateTemplateData(this, actionId);

      if (validTemplate) { this.#placeActionTemplate(actionId); }
    }

    const chatData = {
      user: game.user?.id,
      speaker: ChatMessage.getSpeaker({ actor: this }),
      sound: CONFIG.sounds.dice,
      rolls: rolls.map(({ roll }) => roll),
      flags: {
        a5e: {
          actorId: this.actor.uuid,
          cardType: 'item',
          img: this.actions[actionId].img ?? this.img ?? 'icons/svg/item-bag.svg',
          name: this.name,
          actionName: this.actions[actionId].name,
          prompts: promise.prompts,
          rollData: rolls.map(({ roll, ...rollData }) => rollData)
        }
      },
      content: '<article></article>'
    };

    ChatMessage.create(chatData);
  }

  async #placeActionTemplate(actionId) {
    const templateDocument = createTemplateDocument(this, actionId);
    const template = new ItemMeasuredTemplate(templateDocument);

    template.item = this;
    template.actorSheet = this.actor?.sheet || null;

    Hooks.call('a5e.preItemTemplateCreate', templateDocument, template);

    if (template) template.drawPreview();
  }

  async #prepareItemRolls(rolls) {
    const { attack, other } = rolls.reduce((acc, roll) => {
      if (roll && roll?.type === 'attack') acc.attack = roll;
      else acc.other.push(roll);

      return acc;
    }, { attack: null, other: [] });

    const attackRoll = await this.#prepareAttackRoll(attack ?? {});

    const otherRolls = await Promise.all(
      other.map(async (roll) => this.#prepareItemRoll(roll, attackRoll?.isCrit))
    );

    return [attackRoll, ...otherRolls].filter(Boolean);
  }

  #prepareItemRoll(roll, isCrit) {
    switch (roll?.type) {
      case 'abilityCheck':
        return this.#prepareAbilityCheckRoll(roll);
      case 'damage':
        return this.#prepareDamageRoll(roll, isCrit);
      case 'generic':
        return this.#prepareGenericRoll(roll);
      case 'healing':
        return this.#prepareHealingRoll(roll);
      case 'savingThrow':
        return this.#prepareSavingThrowRoll(roll);
      case 'skillCheck':
        return this.#prepareSkillCheckRoll(roll);
      case 'toolCheck':
        return this.#prepareToolCheckRoll(roll);
      default: return null;
    }
  }

  async #prepareAbilityCheckRoll(_roll) {
    const ability = localize(
      CONFIG.A5E.abilities[_roll?.ability ?? '']
    );

    const { rollFormula } = localize('A5E.AbilityCheckSpecific', { ability });

    if (!rollFormula) return null;

    const roll = await new D20Roll(rollFormula).evaluate({ async: true });
    const label = localize('A5E.AbilityCheckSpecific', { ability });

    return {
      label,
      roll,
      type: 'abilityCheck'
    };
  }

  async #prepareAttackRoll(_roll) {
    const { rollFormula } = constructRollFormula({ actor: this.actor, formula: _roll.formula });

    if (!rollFormula) return null;

    const roll = await new D20Roll(rollFormula).evaluate({ async: true });
    const label = localize(CONFIG.A5E.attackTypes[_roll?.attackType ?? 'meleeWeaponAttack']);

    const isCrit = roll.dice[0].total >= (_roll.critThreshold ?? 20);

    return {
      isCrit,
      label,
      roll,
      type: 'attack'
    };
  }

  async #prepareDamageRoll(_roll, isCrit) {
    const { damageType } = _roll;
    const { rollFormula } = constructRollFormula({ actor: this.actor, formula: _roll.formula });

    if (!rollFormula) return null;

    let roll = await new Roll(rollFormula).evaluate({ async: true });

    if (isCrit) {
      roll = await Roll.fromTerms([
        ...roll.terms,
        await new OperatorTerm({ operator: '+' }).evaluate({ async: true }),
        await new NumericTerm({
          number: roll.total,
          options: { flavor: localize('A5E.CritDamage') }
        }).evaluate({ async: true })
      ]);
    }

    const label = damageType
      ? localize('A5E.DamageSpecific', {
        damageType: localize(CONFIG.A5E.damageTypes[damageType])
      })
      : localize('A5E.Damage');

    return {
      label,
      roll,
      type: 'damage'
    };
  }

  async #prepareGenericRoll(_roll) {
    const { rollFormula } = constructRollFormula({ actor: this.actor, formula: _roll.formula });

    if (!rollFormula) return null;

    const roll = await new Roll(rollFormula).evaluate({ async: true });
    const label = roll.label ?? localize('A5E.GenericRoll');

    return {
      label,
      roll,
      type: 'generic'
    };
  }

  async #prepareHealingRoll(_roll) {
    const { rollFormula } = constructRollFormula({ actor: this.actor, formula: _roll.formula });

    if (!rollFormula) return null;

    const roll = await new Roll(rollFormula).evaluate({ async: true });
    const label = localize(CONFIG.A5E.healingTypes[roll.healingType ?? 'healing']);

    return {
      label,
      roll,
      type: 'healing'
    };
  }

  async #prepareSavingThrowRoll(_roll) {
    const { rollFormula } = this.actor.getDefaultSavingThrowData(_roll.ability);

    if (!rollFormula) return null;

    const ability = localize(CONFIG.A5E.abilities[_roll?.ability ?? '']);
    const roll = await new D20Roll(rollFormula).evaluate({ async: true });
    const label = localize('A5E.SavingThrowSpecific', { ability });

    return {
      label,
      roll,
      type: 'savingThrow'
    };
  }

  async #prepareSkillCheckRoll(_roll) {
    const skill = localize(CONFIG.A5E.skills[_roll?.skill]);

    const { abilityKey: ability, rollFormula } = this.actor.getDefaultSkillCheckData(
      _roll.skill,
      _roll.ability
    );

    if (!rollFormula) return null;

    const roll = await new D20Roll(rollFormula).evaluate({ async: true });

    const label = ability
      ? localize('A5E.SkillCheckAbility', { skill, ability: localize(CONFIG.A5E.abilities[ability]) })
      : localize('A5E.SkillCheck', { skill });

    return {
      label,
      roll,
      type: 'skillCheck'
    };
  }

  async #prepareToolCheckRoll(_roll) {
    const abilityKey = _roll.ability === 'none' ? null : _roll.ability;
    const isProficient = this.actor.system.proficiencies?.tools?.includes(_roll.tool);
    const modifiers = [];

    const tools = Object.values(CONFIG.A5E.tools).reduce(
      (acc, curr) => ({ ...acc, ...curr }),
      {}
    );

    const label = localize('A5E.ToolCheckSpecific', {
      tool: localize(tools[_roll?.tool] ?? '')
    });

    // Check if ability configured
    if (abilityKey) {
      modifiers.push({
        label: localize('A5E.AbilityCheckMod', {
          ability: localize(CONFIG.A5E.abilities[abilityKey])
        }),
        value: this.actor.system.abilities[abilityKey]?.check.mod
      });
    }

    // Check tool prof
    if (isProficient) {
      modifiers.push({
        label: localize('A5E.Proficiency'),
        value: this.actor.system.attributes.prof
      });
    }

    // Add Global Ability bonus
    modifiers.push({
      label: localize('A5E.AbilityCheckBonusGlobal'),
      value: this.actor.system.bonuses.abilities.check
    });

    const { rollFormula } = constructD20RollFormula({ actor: this.actor, modifiers });

    if (!rollFormula) return null;

    const roll = await new D20Roll(rollFormula).evaluate({ async: true });

    return {
      label,
      roll,
      type: 'toolCheck'
    };
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
