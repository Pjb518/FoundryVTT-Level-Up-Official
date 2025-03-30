import { TJSDialog } from "#runtime/svelte/application";
import { SvelteApplicationMixin } from "../../../../lib/ApplicationMixin/SvelteApplicationMixin.svelte";

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class GenericDialog extends SvelteApplicationMixin(
  foundry.applications.api.ApplicationV2,
) {
  data;

  root = null;

  constructor(title, component, data = {}, options = {}) {
    super({
      title,
      classes: ["a5e-sheet"],
      position: {
        width: options.width ?? 420,
        height: options.height ?? "auto",
      },
    });

    this.data = data;
    this.root = component;

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
