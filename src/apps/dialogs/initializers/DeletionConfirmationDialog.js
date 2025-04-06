import { SvelteApplicationMixin } from "../../../../lib/ApplicationMixin/SvelteApplicationMixin.svelte";

import DeletionConfirmationDialogComponent from "../DeletionConfirmationDialog.svelte";

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class DeletionConfirmationDialog extends SvelteApplicationMixin(
  foundry.applications.api.ApplicationV2,
) {
  data;

  root = DeletionConfirmationDialogComponent;

  constructor(itemDocument, hideDeleteSection = false) {
    super({
      classes: ["a5e-sheet"],
      position: { width: 420, height: "auto" },
      window: {
        title: `${itemDocument?.name}: Confirm Deletion`,
      },
    });

    this.data = { itemDocument, hideDeleteSection };

    this.promise = new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  async _prepareContext() {
    return {
      ...this.data,
      dialog: this,
    };
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
