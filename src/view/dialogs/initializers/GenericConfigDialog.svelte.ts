import { SvelteApplicationMixin } from "#lib/ApplicationMixin/SvelteApplicationMixin.svelte.ts";

/**
 * Provides a dialog for creating documents that by default is modal and not resizable.
 */
export class GenericConfigDialog extends SvelteApplicationMixin(
  foundry.applications.api.ApplicationV2,
) {
  data: Record<string, any>;

  protected root: any;

  constructor(
    document: any,
    title: string,
    component: any,
    data: Record<string, any> = {},
    options: Record<string, any> = {},
  ) {
    // @ts-expect-error
    super({
      classes: ["a5e-sheet"],
      position: {
        width: options.width ?? 420,
        height: options.height ?? "auto",
      },
      window: { title },
    });

    this.data = data;
    this.document = document;
    this.root = component;

    this.promise = new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  static override DEFAULT_OPTIONS = {
    classes: ["a5e-sheet a5e-sheet--dialog"],
    position: { width: 420, height: "auto" },
  };

  override async _prepareContext() {
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
