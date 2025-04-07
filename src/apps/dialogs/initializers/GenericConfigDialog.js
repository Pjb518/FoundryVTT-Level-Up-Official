import { TJSDialog } from "#runtime/svelte/application";
import { TJSDocument } from "#runtime/svelte/store/fvtt/document";
import { SvelteApplicationMixin } from "../../../../lib/ApplicationMixin/SvelteApplicationMixin.svelte";

import ItemDocument from "../../ItemDocument";

/**
 * Provides a dialog for creating documents that by default is modal and not resizable.
 */
export default class GenericConfigDialog extends SvelteApplicationMixin(
  foundry.applications.api.ApplicationV2,
) {
  data;

  constructor(document, title, component, data = {}, options = {}) {
    // TODO: Refactor - Revisit this to see if this is what we wanna do
    const doc = options.isItemDocument
      ? new ItemDocument(document)
      : new TJSDocument(document);
    delete options.isItemDocument;

    if (data.actionName) title = `Action: ${title}`;

    super({
      classes: ["a5e-sheet"],
      position: {
        width: options.width ?? 420,
        height: options.height ?? "auto",
      },
      window: { title },
    });

    this.data = data;
    this.document = doc;
    this.root = component;

    console.log("Running GenericConfigDialog constructor");

    this.promise = new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  static DEFAULT_OPTIONS = {
    classes: ["a5e-sheet"],
    position: { width: 420, height: "auto" },
  };

  // static get defaultOptions() {
  //   return foundry.utils.mergeObject(super.defaultOptions, {
  //     classes: ["a5e-sheet"],
  //     minimizable: true,
  //     svelte: {
  //       target: document.body,
  //     },
  //   });
  // }

  async _prepareContext() {
    return {
      ...this.data,
      document: this.document,
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
    this.document?.destroy();

    return super.close();
  }

  #resolvePromise(data) {
    if (this.resolve) {
      this.resolve(data);
    }
  }
}
