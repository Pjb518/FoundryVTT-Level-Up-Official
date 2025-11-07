import { unmount } from "svelte";

import { localize } from "#utils/localization/localize.ts";

/**
 * Extends the Token HUD class to add system specific options
 */
export default class TokenHUDA5e extends foundry.applications.hud.TokenHUD {
  declare _svelteComponent;

  override async _prepareContext(options) {
    const context = await super._prepareContext(options);
    return context;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    html
      .find(".clear-all-conditions")
      .click(this._clearAllConditions.bind(this));
  }

  /** @override */
  _getOverrideStatusEffectChoices() {
    let statusEffects = super._getStatusEffectChoices();

    let genericEffects = Object.entries(statusEffects ?? {})
      .filter(([key]) => key.includes("generic"))
      .map(([, value]) => value);

    statusEffects = Object.entries(statusEffects ?? {})
      .filter(([key]) => !key.includes("generic"))
      .map(([, value]) => value);

    return { statusEffects, genericEffects };
  }

  /**
   * Removes all conditions on the current object
   * @param {*} event
   */
  async _clearAllConditions(event) {
    event.preventDefault();
    event.stopPropagation();

    const removals = [];
    const conditions = CONFIG.statusEffects;

    for (const condition of conditions) {
      const existing = this.object.actor.effects.reduce((arr, e) => {
        if (e.statuses.size === 1 && e.statuses.has(condition.id))
          arr.push(e.id);
        return arr;
      }, []);

      if (existing.length) removals.push(...existing);
    }

    this.object.actor.deleteEmbeddedDocuments("ActiveEffect", removals);
    this.object.actor.update({
      "system.attributes.fatigue": 0,
      "system.attributes.strife": 0,
      "flags.a5e.autoApplyFSConditions": false,
    });
  }

  /**
   * Destroy svelte components when the HUD is closed
   */
  clear() {
    super.clear();

    if (this._svelteComponent) {
      unmount(this._svelteComponent);
      this._svelteComponent = null;
    }
  }
}
