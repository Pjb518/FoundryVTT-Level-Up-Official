import { SvelteApplicationMixin } from "../../../../lib/ApplicationMixin/SvelteApplicationMixin.svelte";

import ModuleIncompatibilityDialogComponent from "../ModuleIncompatibilityDialog.svelte";

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class ModuleIncompatibilityDialog extends SvelteApplicationMixin(
  foundry.applications.api.ApplicationV2,
) {
  data;

  root = ModuleIncompatibilityDialogComponent;

  constructor(activeIncompatibleModules) {
    super({
      classes: ["a5e-sheet a5e-sheet--announcement"],
      position: { width: 540, height: "auto" },
      window: {
        title: "Module Notices",
      },
    });

    this.data = { activeIncompatibleModules };

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
