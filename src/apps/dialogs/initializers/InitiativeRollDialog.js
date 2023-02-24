// eslint-disable-next-line import/no-unresolved
import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';

import InitiativeRollDialogComponent from '../InitiativeRollDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class InitiativeRollDialog extends TJSDialog {
  constructor(combatant, options) {
    super({
      title: game.i18n.format('A5E.InitiativePromptTitle', { name: combatant.name }),
      content: {
        class: InitiativeRollDialogComponent,
        props: { combatant, options }
      }
    }, {
      classes: ['a5e-sheet'],
      width: 528
    });

    this.data.content.props.dialog = this;

    this.promise = new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  /** @inheritdoc */
  close(options) {
    this.#resolvePromise(null);
    return super.close(options);
  }

  /**
   * Resolves the dialog's promise and closes it.
   *
   * @param {object} results
   * @returns
   */
  submit(results) {
    this.#resolvePromise(results);
    return super.close();
  }

  #resolvePromise(data) {
    if (this.resolve) {
      this.resolve(data);
    }
  }
}
