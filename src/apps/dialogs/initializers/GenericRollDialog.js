import { TJSDialog } from '#runtime/svelte/application';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class GenericRollDialog extends TJSDialog {
  constructor(document, title, component, data = {}, rollOptions = {}, windowOptions = {}) {
    super({
      title,
      content: {
        class: component,
        props: { document, ...data, options: rollOptions }
      }
    }, {
      classes: ['a5e-sheet'],
      height: windowOptions.height ?? 'auto',
      width: windowOptions.width ?? 420,
      resizable: windowOptions.resizable ?? false
    });

    this.data.content.props.dialog = this;

    this.promise = new Promise((resolve) => {
      this.resolve = resolve;
    });
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
