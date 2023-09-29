/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { localize } from '#runtime/svelte/helper';

/**
 * Extends the Token HUD class to add system specific options
 */
export default class TokenHUDA5e extends TokenHUD {
  /** @override */
  getData() {
    const data = foundry.utils.mergeObject(super.getData(), {
      AC: this.object.actor?.system?.attributes?.ac?.value ?? 10
    });

    const [genericConditions, statusEffects] = Object.entries(data.statusEffects)
      .reduce((acc, [key, value]) => {
        if (value.id.includes('generic')) acc[0][key] = value;
        else acc[1][key] = value;
        return acc;
      }, [{}, {}]);

    data.statusEffects = statusEffects;
    data.genericConditions = genericConditions;

    return data;
  }

  /** @override */
  get template() {
    return 'systems/a5e/templates/hud/token-hud.hbs';
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    html.find('.clear-all-conditions').click(this._clearAllConditions.bind(this));
  }

  /** @override */
  _getStatusEffectChoices() {
    CONFIG.statusEffects = CONFIG.statusEffects.sort((a, b) => {
      const aid = (a.label !== undefined ? localize(a.label) : a.id || a);
      const bid = (b.label !== undefined ? localize(b.label) : b.id || b);

      // eslint-disable-next-line no-nested-ternary
      return (aid > bid ? 1 : (aid < bid ? -1 : 0));
    });

    return super._getStatusEffectChoices();
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
        if ((e.statuses.size === 1) && e.statuses.has(condition.id)) arr.push(e.id);
        return arr;
      }, []);

      if (existing.length) removals.push(...existing);
    }

    this.object.actor.deleteEmbeddedDocuments('ActiveEffect', removals);
    this.object.actor.update({ 'system.attributes.fatigue': 0, 'system.attributes.strife': 0 });
  }

  /**
   * Destroy svelte components when the HUD is closed
   */
  clear() {
    super.clear();
    if (this?._svelteComponent?.$destroy) {
      this._svelteComponent.$destroy();
      this._svelteComponent = null;
    }
  }
}
