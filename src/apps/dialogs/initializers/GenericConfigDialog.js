// eslint-disable-next-line import/no-unresolved
import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class GenericConfigDialog extends TJSDialog {
  constructor(actorDocument, title, component, data = {}, options = {}) {
    super({
      title,
      content: {
        class: component,
        props: { actorDocument, ...data }
      }
    }, {
      classes: ['a5e-sheet'],
      width: options.width ?? 420
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
