import { SvelteApplicationMixin } from "../../../../lib/ApplicationMixin/SvelteApplicationMixin.svelte";

import SpellbookDeletionConfirmationDialogComponent from "../SpellbookDeletionConfirmationDialog.svelte";

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class SpellbookDeletionConfirmationDialog extends SvelteApplicationMixin(
  foundry.applications.api.ApplicationV2,
) {
  root = SpellbookDeletionConfirmationDialogComponent;

  constructor() {
    super({
      classes: ["a5e-sheet"],
      position: { width: 420, height: "auto" },
      window: {
        title: "Confirm Spellbook Deletion",
      },
    });

    this.promise = new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  async _prepareContext() {
    return { dialog: this };
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
