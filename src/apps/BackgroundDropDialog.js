import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';

import BackgroundDropDialogComponent from './dialogs/BackgroundDropDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class BackgroundDropDialog extends TJSDialog {
  constructor(item) {
    super(
      {
        title: 'Test',
        content: {
          class: BackgroundDropDialogComponent,
          props: { itemDocument: item }
        }
      },
      { classes: ['a5e-sheet'], width: 480 }
    );

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
