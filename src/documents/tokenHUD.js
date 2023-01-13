/**
 * Extends the Token HUD class to add system specific options
 */
export default class TokenHUD5e extends TokenHUD {
  /** @override */
  getData() {
    let data = super.getData();
    data = foundry.utils.mergeObject(data, {
      AC: this.object.actor?.system?.attributes?.ac || false
    });
    return data;
  }

  /** @override */
  get template() {
    return 'systems/a5e/templates/hud/token-hud.hbs';
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    html
      .find('.clear-all-conditions')
      .click(this._clearAllConditions.bind(this));
  }

  /** @override */
  _getStatusEffectChoices() {
    CONFIG.statusEffects = CONFIG.statusEffects.sort((a, b) => {
      const aid =
        a.label !== undefined ? game.i18n.localize(a.label) : a.id || a;
      const bid =
        b.label !== undefined ? game.i18n.localize(b.label) : b.id || b;
      // eslint-disable-next-line no-nested-ternary
      return aid > bid ? 1 : aid < bid ? -1 : 0;
    });

    return super._getStatusEffectChoices();
  }

  /**
   * Removes all conditions on the current object
   * @param {*} event
   */
  async _clearAllConditions(event) {
    event.stopPropagation();
    const conditions = this._getStatusEffectChoices();

    // NOTE: When toggleEffect is called, it updates all effects.
    // So effects which are pending changes could get "untoggled"
    // So we must await each effect to ensure all effects are untoggled.
    // In theory we could do the toggle ourselves, but the logic seems non-trivial.

    // eslint-disable-next-line no-restricted-syntax
    for (const condition of Object.values(conditions)) {
      if (condition.isActive) {
        // eslint-disable-next-line no-await-in-loop
        await this.object.toggleEffect({
          id: condition.id,
          icon: condition.src
        });
      }
    }
  }
}
