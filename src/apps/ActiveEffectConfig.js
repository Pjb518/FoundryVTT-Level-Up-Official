// eslint-disable-next-line import/no-unresolved
import { SvelteApplication } from '@typhonjs-fvtt/runtime/svelte/application';
// eslint-disable-next-line import/no-unresolved
import { TJSDocument } from '@typhonjs-fvtt/runtime/svelte/store';

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
        title: `Configure Active Effect: ${activeEffect.label}`,
        svelte: {
          class: ActiveEffectConfigSheet,
          props: {
            effect: null
          }
        }
      }
    ));

    this.activeEffect = activeEffect;
    this.options.svelte.props.document = new TJSDocument(
      document,
      { delete: this.close.bind(this) }
    );

    this.options.svelte.props.sheet = this;
  }
}
