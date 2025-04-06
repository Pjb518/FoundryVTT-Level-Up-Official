import { SvelteApplicationMixin } from "../../../../lib/ApplicationMixin/SvelteApplicationMixin.svelte";

import NoteConfigDialogComponent from "../NoteConfigDialog.svelte";

export default class NoteConfigDialog extends SvelteApplicationMixin(
  foundry.applications.api.ApplicationV2,
) {
  data;

  root = NoteConfigDialogComponent;

  constructor(actorDocument, updatePath) {
    super({
      classes: ["a5e-sheet"],
      position: { width: 560, height: "auto" },
      window: {
        title: "Note Configuration Dialog",
      },
    });

    this.data = { actorDocument, updatePath };

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
