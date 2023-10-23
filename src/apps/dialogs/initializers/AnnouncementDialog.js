import { TJSDialog } from '#runtime/svelte/application';

import AnnouncementDialogComponent from '../AnnouncementDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class AnnouncementDialog extends TJSDialog {
  constructor(title) {
    super({
      title,
      content: {
        class: AnnouncementDialogComponent,
        props: {}
      }
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
