import { SvelteApplicationMixin } from "../../../../lib/ApplicationMixin/SvelteApplicationMixin.svelte";

import ActionActivationDialogComponent from "../ActionActivationDialog.svelte";

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class ActionActivationDialog extends SvelteApplicationMixin(
  foundry.applications.api.ApplicationV2,
) {
  data;

  root = ActionActivationDialogComponent;

  constructor({ actionId, actorDocument, itemDocument, options = {} }) {
    super({
      classes: ["a5e-sheet"],
      position: { width: 420, height: "auto" },
      window: {
        title: `${actorDocument.name}: Activate ${itemDocument.actions.get(actionId).name}`,
      },
    });

    this.data = { actionId, actorDocument, itemDocument };

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
