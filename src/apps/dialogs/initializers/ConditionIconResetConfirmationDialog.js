import { TJSDialog } from '#runtime/svelte/application';

import ConditionIconResetConfirmationDialogComponent from '../ConditionIconResetConfirmationDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class ConditionIconResetConfirmationDialog extends TJSDialog {
  constructor() {
    super({
      title: 'Condition Icons Reset Confirmation',
      content: {
        class: ConditionIconResetConfirmationDialogComponent,
        props: {}
      }
    }, {
      classes: ['a5e-sheet'],
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
