import { TJSDialog } from '#runtime/svelte/application';

import BackgroundDropDialogComponent from '../BackgroundDropDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class BackgroundDropDialog extends TJSDialog {
  constructor(actorDocument, itemDocument) {
    super({
      title: 'Test',
      content: {
        class: BackgroundDropDialogComponent,
        props: { actorDocument, itemDocument }
      }
    }, { classes: ['a5e-sheet'], width: 480 });

    this.promise = new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  close(options) {
    this.resolvePromise(null);
    return super.close(options);
  }

  resolvePromise(data) {
    if (this.resolve) {
      this.resolve(data);
    }
  }

  submit(data) {
    this.resolvePromise(data);
    return super.close();
  }
}
