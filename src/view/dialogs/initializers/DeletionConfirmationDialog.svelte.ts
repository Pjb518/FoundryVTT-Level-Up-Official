import { SvelteApplicationMixin } from "#lib/ApplicationMixin/SvelteApplicationMixin.svelte.ts";

import Component from "../DeletionConfirmationDialog.svelte";

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export class DeletionConfirmationDialog extends SvelteApplicationMixin(
  foundry.applications.api.ApplicationV2,
) {
  data;

  root = Component;

  constructor(
    itemDocument: any = undefined,
    hideDeleteSection = false,
    type = "",
  ) {
    //@ts-expect-error
    super({
      classes: ["a5e-sheet", "a5e-sheet--dialog"],
      position: { width: 420, height: "auto" },
      window: {
        title: `${itemDocument?.name ?? type}: Confirm Deletion`,
      },
    });

    this.data = { itemDocument, hideDeleteSection, type };

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
   * @returns
   */
  submit(results: any) {
    this.#resolvePromise(results);
    return super.close();
  }

  #resolvePromise(data: any) {
    if (this.resolve) {
      this.resolve(data);
    }
  }
}
