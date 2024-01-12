import { TJSDialog } from '#runtime/svelte/application';

import ModuleIncompatibilityDialogComponent from '../ModuleIncompatibilityDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class ModuleIncompatibilityDialog extends TJSDialog {
  constructor(activeIncompatibleModules) {
    super({
      title: 'Module Notices',
      content: {
        class: ModuleIncompatibilityDialogComponent,
        props: { activeIncompatibleModules }
      },
      zIndex: null
    }, {
      classes: ['a5e-sheet a5e-sheet--announcement'],
      width: 540
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
