import { TJSDialog } from '#runtime/svelte/application';

import ActionActivationDialogComponent from '../ActionActivationDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class ActionActivationDialog extends TJSDialog {
  constructor({
    actionId, actorDocument, itemDocument, options = {}
  }) {
    super({
      title: `${actorDocument.name}: Activate ${itemDocument.actions.get(actionId).name}`,
      content: {
        class: ActionActivationDialogComponent,
        props: {
          actionId, actorDocument, itemDocument, options
        }
      },
      zIndex: null
    }, {
      classes: ['a5e-sheet', 'a5e-activation-dialog'],
      width: 420
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
