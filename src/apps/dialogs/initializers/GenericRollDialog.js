import { SvelteApplicationMixin } from "../../../../lib/ApplicationMixin/SvelteApplicationMixin.svelte";

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class GenericRollDialog extends SvelteApplicationMixin(
  foundry.applications.api.ApplicationV2,
) {
  data;

  root = null;

  constructor(
    document,
    title,
    component,
    data = {},
    rollOptions = {},
    dialogOptions = {},
  ) {
    super({
      classes: ["a5e-sheet"],
      position: {
        width: dialogOptions.width ?? 420,
        height: dialogOptions.height ?? "auto",
      },
      window: { title, resizable: dialogOptions.resizable ?? false },
    });

    this.root = component;

    this.data = {
      document,
      ...data,
      options: rollOptions,
    };

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
