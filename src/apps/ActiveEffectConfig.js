import { localize } from '#runtime/svelte/helper';
import { TJSDocument } from '#runtime/svelte/store/fvtt/document';
import { SvelteApplication } from '#runtime/svelte/application';

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
        id: activeEffect.parent
          ? `effect-${activeEffect.parent.id}-${activeEffect.id}`
          : `effect-${activeEffect.id}`,
        title: `Configure Active Effect: ${activeEffect.name}`,
        svelte: {
          class: ActiveEffectConfigSheet,
          props: {
            document: null
          }
        },
        resizable: true,
        focusAuto: false,
        width: 505,
        height: 500
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

    const usableOptions = activeEffect.parent?.documentName === 'Actor'
      ? game.a5e.activeEffects.options[this.activeEffect.parent.type]
      : game.a5e.activeEffects.options.all;

    this.optionsList = usableOptions.allOptions;
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
