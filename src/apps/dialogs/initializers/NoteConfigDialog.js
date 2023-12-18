import { TJSDialog } from '#runtime/svelte/application';

import NoteConfigDialogComponent from '../NoteConfigDialog.svelte';

export default class NoteConfigDialog extends TJSDialog {
  constructor(actorDocument, updatePath) {
    super({
      title: 'Note Configuration Dialog',
      content: {
        class: NoteConfigDialogComponent,
        props: { actorDocument, updatePath }
      }
    }, {
      classes: ['a5e-sheet'],
      width: 560
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
