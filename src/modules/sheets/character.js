import { createApp } from 'vue';

import ActorSheetComponent from '../../vue/sheets/ActorSheet.vue';

export default class ActorSheet5eCharacter extends ActorSheet {
  /** @override */
  constructor(...args) {
    super(...args);

    this._disable_popout_module = true;
    this.component = null;
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['a5e-sheet', 'a5e-sheet--actor'],
      width: 880,
      height: 700
    });
  }

  get template() {
    if (!game.user.isGM && this.actor.limited) return 'systems/a5e/templates/limited-actor-sheet.hbs';
    return 'systems/a5e/templates/sheet.html';
  }

  getData() {
    const data = {};
    const actorData = this.actor.toObject(false);

    data.name = actorData.name;
    data.img = actorData.img;
    data.type = actorData.type;

    data.data = actorData.system;
    data.flags = actorData.flags;
    data.items = actorData.items;

    Object.entries(actorData.system.abilities).forEach(([key, ability]) => {
      ability.label = game.i18n.localize(CONFIG.A5E.abilityAbbreviations[key]);
    });

    return data;
  }

  activateVueListeners(html) {
    // Remove existing listeners
    $(this.form).find('.a5e-js-item').off('dragstart');

    // Drag and drop handlers
    html.find('.a5e-js-item').on('dragstart', (event) => {
      this._onDragStart.call(this, event.originalEvent);
    });
  }

  /** @override */
  async render(force = false, options = {}) {
    if (!game.user.isGM && this.actor.limited) {
      super.render(force, options);
      return;
    }

    if (this.component) {
      const states = Application.RENDER_STATES;
      if (this._state === states.RENDERING || this._state === states.RENDERED) return;
    }

    try {
      await this._render(force, options);
    } catch (err) {
      err.message = `An error occurred while rendering ${this.constructor.name} ${this.appId}: ${err.message}`;
      console.error(err.message);
      this._state = Application.RENDER_STATES.ERROR;
    }

    const componentWrapper = this.element.find('.a5e-js-component-wrapper')[0];

    this.component = createApp(ActorSheetComponent, { actor: this.actor, sheet: this });
    this.component.mount(componentWrapper);
    this.activateListeners($(this.form));
    this.activateVueListeners($(this.form));
  }

  /** @override */
  async _updateObject(event, formData) {
    const fractionalChallengeRatings = { '1/8': 0.125, '1/4': 0.25, '1/2': 0.5 };

    let cr = formData['data.details.cr'];
    cr = fractionalChallengeRatings[cr] || parseFloat(cr);

    if (cr) formData['data.details.cr'] = cr < 1 ? cr : parseInt(cr, 10);

    return super._updateObject(event, formData);
  }
}
