/* eslint-disable import/no-unresolved */
import { SvelteApplication } from '@typhonjs-fvtt/runtime/svelte/application';
import { TJSDocument } from '@typhonjs-fvtt/runtime/svelte/store';
import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';

import ActiveEffectConfigSheet from './sheets/ActiveEffectConfig.svelte';

export default class ActiveEffectConfigA5e extends SvelteApplication {
  /**
   * @inheritDoc
   */
  constructor(activeEffect, options = {}) {
    options.svelte ??= {};

    super(foundry.utils.mergeObject(
      options,
      {
        baseApplication: 'ActiveEffectConfig',
        id: activeEffect.id,
        title: `Configure Active Effect: ${activeEffect.name}`,
        svelte: {
          class: ActiveEffectConfigSheet,
          props: {
            document: null
          }
        },
        resizable: true,
        width: 560
      }
    ));

    this.activeEffect = activeEffect;
    this.options.svelte.props.document = new TJSDocument(
      activeEffect,
      { delete: this.close.bind(this) }
    );

    this.options.svelte.props.sheet = this;

    // Add Status Effects
    this.statusEffectList = {};
    const effectList = CONFIG.statusEffects
      .filter((effect) => effect.id)
      .map((effect) => ({ id: effect.id, label: localize(effect.label) }))
      .sort((a, b) => (a.label < b.label ? -1 : 1));

    effectList.forEach((effect) => {
      this.statusEffectList[effect.id] = effect.label;
    });

    // TODO: Add a union type for items
    const usableOptions = game.a5e.activeEffects.EffectOptions
      .options[this.activeEffect.parent.type];

    this.optionsList = usableOptions.allOptionsObj;
  }

  /**
   * Default Application options
   *
   * @returns {object} options - Application options.
   * @see https://foundryvtt.com/api/Application.html#options
   */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      baseApplication: 'ActiveEffectConfig',
      classes: ['a5e-sheet', 'a5e-sheet--active-effect'],
      minimizable: true,
      resizable: true,
      svelte: {
        target: document.body
      }
    });
  }

  get title() {
    return `${game.i18n.localize('EFFECT.ConfigTitle')}: ${this.activeEffect.name}`;
  }

  get isActorEffect() {
    return this.activeEffect?.parent.documentName === 'Actor';
  }

  get isActionEffect() {
    return this.activeEffect?.parent.documentName === 'Action';
  }

  get isItemEffect() {
    return this.activeEffect?.parent.documentName === 'Item';
  }

  _getHeaderButtons() {
    const buttons = super._getHeaderButtons();

    if (!this.activeEffect.pack) {
      buttons.unshift({
        label: 'Sheet Configuration',
        class: 'configure-sheet',
        icon: 'fas fa-cog fa-fw',
        title: 'Configure Sheet',
        onclick: (event) => this._onConfigureSheet(event)
      });
    }

    return buttons;
  }

  _onConfigureSheet(event) {
    if (event) event.preventDefault();

    const sheetConfigDialog = new DocumentSheetConfig(
      this.activeEffect,
      { top: this.position.top + 40 }
    );
    sheetConfigDialog.render(true);
  }
}
