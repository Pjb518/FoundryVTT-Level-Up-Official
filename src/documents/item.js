import getChatCardTargets from '../modules/utils/getChatCardTargets';
import getDeterministicBonus from '../modules/dice/getDeterministicBonus';
import ItemMeasuredTemplate from '../modules/pixi/ItemMeasuredTemplate';
import createTemplateDocument from '../modules/utils/templates/createTemplateDocument';

/**
 * Override and extend the basic Item implementation.
 * @extends {Item}
 */
export default class Item5e extends Item {
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
    return Object.entries(this.system.actions);
  }

  get activationTypes() {
    const actions = Object.values(this.system.actions);

    return actions.reduce((acc, action) => {
      if (action.activation?.type) acc.push(action.activation.type);
      return acc;
    }, []);
  }

  get hasRoll() {
    const { actions } = this.system;
    return Object.values(actions).some((action) => (!!Object.values(action.rolls)?.length));
  }

  get hasPrompt() {
    const { actions } = this.system;
    return Object.values(actions).some((action) => (!!Object.values(action.prompts)?.length));
  }

  get hasConsumer() {
    const { actions } = this.system;
    return Object.values(actions).some((action) => (!!Object.values(action.consumers)?.length));
  }

  get hasRange() {
    const { actions } = this.system;
    return Object.values(actions).some((action) => (!!Object.values(action.ranges)?.length));
  }

  // *****************************************************************************************

  // FIXME: Needs complete refactor
  async activate(options = {}) {
    const itemData = this.system;
    const rollData = this.actor.getRollData();
    let attack;
    let damage;
    let healing;
    let placeTemplate;

    const dialogTitle = game.i18n.format(
      'A5E.ItemActivationPrompt',
      { name: this.actor.name, itemName: this.name }
    );

    // const dialog = new ReactiveDialog(ItemActivationDialog, {
    //   title: dialogTitle, props: { actor: this.actor, item: this, rollMode: options.rollMode }
    // });

    const data = {
      id: this.id,
      img: this.img,
      title: this.name,
      description: itemData.description,
      actionOptions: itemData.actionOptions,
      isCrit: null,
      isFumble: null,
      attack: null,
      damage: null,
      healing: null,
      abilityCheck: {
        ...itemData.check,
        label: game.i18n.format(
          'A5E.RollPromptAbilityCheck',
          { ability: game.i18n.localize(CONFIG.A5E.abilities[itemData.check.ability]) }
        )
      },
      savingThrow: {
        dc: getDeterministicBonus(itemData.save.dc, rollData),
        label: game.i18n.format(
          'A5E.RollPromptSavingThrow',
          { ability: game.i18n.localize(CONFIG.A5E.abilities[itemData.save.targetAbility]) }
        ),
        targetAbility: itemData.save.targetAbility
      }
    };

    if (
      ['attack', 'damage', 'healing'].some((option) => itemData.actionOptions.includes(option))
      || this.hasValidTemplateDefinition
    ) {
      // await dialog.render(true);

      // try {
      //   const configuration = await dialog.promise;
      //   attack = configuration.attack;
      //   damage = configuration.damage;
      //   healing = configuration.healing;
      //   placeTemplate = configuration.placeTemplate;
      // } catch {
      //   return;
      // }
    }

    if (itemData.actionOptions.includes('attack')) {
      const roll = new CONFIG.Dice.D20Roll(attack.formula, rollData);
      await roll.evaluate({ async: true });

      data.isCrit = roll.dice[0].total >= itemData.attack.critThreshold;
      data.isFumble = roll.dice[0].total === 1;

      const tooltip = await roll.getTooltip();

      data.attack = {
        roll,
        tooltip
      };
    }

    if (itemData.actionOptions.includes('damage')) {
      data.damage = [];

      // TODO: Refactor this to stop eslint complaining
      for (const { canCrit, damageType, formula } of damage) {
        const roll = new CONFIG.Dice.DamageRoll(
          formula || '0',
          rollData,
          { canCrit, isCrit: data.isCrit }
        );

        await roll.evaluate({ async: true });
        const tooltip = await roll.getTooltip();

        data.damage.push({
          damageType, roll, tooltip
        });
      }
    }

    if (itemData.actionOptions.includes('healing')) {
      data.healing = [];

      // TODO: Refactor this to stop eslint complaining
      for (const { healingType, formula } of healing) {
        const roll = new CONFIG.Dice.DamageRoll(
          formula || '0',
          rollData,
          { canCrit: false }
        );

        await roll.evaluate({ async: true });
        const tooltip = await roll.getTooltip();

        data.healing.push({
          healingType, roll, tooltip
        });
      }
    }

    // Place template if allowed
    if (placeTemplate) {
      const templateDocument = createTemplateDocument(this);
      const template = new ItemMeasuredTemplate(templateDocument);

      template.item = this;
      template.actorSheet = this.actor?.sheet || null;

      Hooks.call('a5e.preItemTemplateCreate', templateDocument, template);

      if (template) template.drawPreview();
    }

    this.actor.constructItemCard(data);
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
