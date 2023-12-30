import { TJSDialog } from '#runtime/svelte/application';
import { TJSDocument } from '#runtime/svelte/store/fvtt/document';

/**
 * Provides a dialog for creating documents that by default is modal and not resizable.
 */
export default class GenericConfigDialog extends TJSDialog {
  constructor(document, title, component, data = {}, options = {}) {
    super({
      title,
      content: {
        class: component,
        props: { document: new TJSDocument(document), ...data }
      },
      zIndex: null
    }, {
      classes: ['a5e-sheet'],
      width: options.width ?? 420,
      height: options.height ?? 'auto',
      resizable: options.resizable ?? false
    });

    this.data.content.props.dialog = this;

    this.promise = new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  /** @inheritdoc */
  close(options) {
    this.#resolvePromise(null);
    this.document?.destroy();

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
