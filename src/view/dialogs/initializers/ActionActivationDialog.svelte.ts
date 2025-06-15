import { SvelteApplicationMixin } from "#lib/ApplicationMixin/SvelteApplicationMixin.svelte.ts";

import ActionActivationDialogComponent from "#view/dialogs/action/ActionActivationDialog.svelte";

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export class ActionActivationDialog extends SvelteApplicationMixin(
  foundry.applications.api.ApplicationV2,
) {
  data;

  root = ActionActivationDialogComponent;

  constructor({ actionId, actorDocument, itemDocument, options = {} }) {
    // @ts-ignore
    super({
      classes: [
        "a5e-sheet",
        "a5e-sheet--dialog",
        "a5e-sheet--action-activation",
      ],
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

  static override DEFAULT_OPTIONS = {
    classes: ["a5e-sheet a5e-sheet--dialog", "a5e-sheet--action-activation"],
    position: { width: 420, height: "auto" },
  };

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
