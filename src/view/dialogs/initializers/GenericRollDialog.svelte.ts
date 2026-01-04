import { SvelteApplicationMixin } from "#lib/ApplicationMixin/SvelteApplicationMixin.svelte.ts";

/**
 * Provides a dialog for creating documents that by default is modal and not resizable.
 */
export default class GenericRollDialog extends SvelteApplicationMixin(
  foundry.applications.api.ApplicationV2,
) {
  data: Record<string, any>;

  protected root: any;

  constructor(
    document: any,
    title: string,
    component: any,
    data: Record<string, any> = {},
    rollOptions: Record<string, any> = {},
    dialogOptions: Record<string, any> = {},
  ) {
    // @ts-expect-error
    super({
      classes: ["a5e-sheet"],
      position: {
        width: dialogOptions.width ?? 420,
        height: dialogOptions.height ?? "auto",
      },
      window: { title },
      svelte: {
        component: component,
        props: () => this._prepareContext()
      }
    });

    this.data = {
      document,
      ...data,
      options: rollOptions,
    };

    this.root = component;

    this.promise = new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  static override DEFAULT_OPTIONS = {
    classes: ["a5e-sheet a5e-sheet--dialog"],
    position: { width: 420, height: "auto" },
  };

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
    return super.close();
  }

  #resolvePromise(data) {
    if (this.resolve) {
      this.resolve(data);
    }
  }
}
