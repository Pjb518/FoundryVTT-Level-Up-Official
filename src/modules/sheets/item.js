import { createApp } from 'vue';

import StandardItemSheet from '../../vue/sheets/ItemSheet.vue';
import BackgroundSheet from '../../vue/sheets/BackgroundSheet.vue';

/**
 * Override and extend the core ItemSheet implementation to handle specific item types.
 * @extends {ItemSheet}
 */
export default class ItemSheet5e extends ItemSheet {
  /** @override */
  constructor(...args) {
    super(...args);

    this._disable_popout_module = true;
    this.component = null;
  }

  get template() {
    return 'systems/a5e/templates/sheet.html';
  }

  /**
   * Define default rendering options for the character sheet.
   *
   * @returns {object}
   */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['a5e-sheet', 'a5e-sheet--item'],
      height: 500,
      width: 540,
      resizable: true
    });
  }

  /** @inheritdoc */
  _getSubmitData(updateData = {}) {
    // Create the expanded update data object
    const formData = new FormDataExtended(this.form, { editors: this.editors });
    let data = formData.object;

    if (updateData) data = foundry.utils.mergeObject(data, updateData);
    else data = expandObject(data);

    const damage = data.data?.damage;
    const healing = data.data?.healing;

    // Handle Damage array
    if (damage) {
      data.data.damage = Object.values(damage || {}).map(({
        canCrit, damageType, defaultSelection, formula, name
      }) => ({
        canCrit: canCrit ?? false,
        damageType: damageType || '',
        defaultSelection: defaultSelection ?? true,
        formula: formula || '',
        name: name || ''
      }));
    }

    // Handle Healing Array
    if (healing) {
      data.data.healing = Object.values(healing || {}).map(({
        defaultSelection, formula, healingType, name
      }) => ({
        defaultSelection: defaultSelection ?? true,
        formula: formula || '',
        healingType: healingType || '',
        name: name || ''
      }));
    }

    // Return the flattened submission data
    return flattenObject(data);
  }

  getData(options) {
    const data = super.getData(options);
    const itemData = data.data;

    data.name = this.item.name;
    data.img = this.item.img;
    data.data = itemData.system;

    return data;
  }

  /** @override */
  async render(force = false, options = {}) {
    let sheetComponent;

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

    if (this.item.type === 'background') sheetComponent = BackgroundSheet;
    else sheetComponent = StandardItemSheet;

    this.component = createApp(
      sheetComponent,
      { actor: this.item.actor, item: this.item, sheet: this }
    );

    this.component.mount(componentWrapper);
    this.activateListeners($(this.form));
  }
}
