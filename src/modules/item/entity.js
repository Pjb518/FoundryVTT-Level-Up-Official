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

  static async _onClickChatAbilityCheckButton(event) {
    /* eslint-disable no-await-in-loop, no-restricted-syntax */
    event.preventDefault();

    const { ability } = event.currentTarget.dataset;
    const targets = this._getChatCardTargets();

    for (const token of targets) {
      await token.actor.rollAbilityCheck(ability);
    }
  }

  static async _onClickChatSavingThrowButton(event) {
    event.preventDefault();

    const { ability } = event.currentTarget.dataset;
    const targets = this._getChatCardTargets();

    for (const token of targets) {
      await token.actor.rollSavingThrow(ability);
    }
  }

  /**
   * Find the currently selected tokens on the canvas.
   *
   * @returns {Actor[]} An Array of Actor documents, if any
   * @private
   */
  static _getChatCardTargets() {
    let targets = canvas.tokens.controlled.filter((target) => !!target.actor);

    if (!targets.length && game.user.character) {
      targets = targets.concat(game.user.character.getActiveTokens());
    }

    if (!targets.length) {
      ui.notifications.warn(game.i18n.localize('A5E.ActionWarningNoSelectedTokens'));
    }

    return targets;
  }

  static _onToggleRollTooltipVisibility(event) {
    event.preventDefault();

    const tooltip = Array.from($(event.currentTarget).siblings('.a5e-dice-tooltip'))[0];
    $(tooltip).slideToggle();
  }
}
