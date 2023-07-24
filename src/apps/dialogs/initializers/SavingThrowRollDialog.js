// eslint-disable-next-line import/no-unresolved
import { localize } from '#runtime/svelte/helper';
import { TJSDialog } from '#runtime/svelte/application';

// eslint-disable-next-line import/no-unresolved

import SavingThrowRollDialogComponent from '../SavingThrowRollDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class SavingThrowRollDialog extends TJSDialog {
  constructor(actorDocument, abilityKey, options) {
    super({
      title: setTitle(),
      content: {
        class: SavingThrowRollDialogComponent,
        props: { actorDocument, abilityKey, options }
      }
    }, {
      classes: ['a5e-sheet'],
      width: 420
    });

    function setTitle() {
      if (options?.saveType === 'death') {
        return localize(
          'A5E.DeathSavingThrowPromptTitle',
          { name: actorDocument.name }
        );
      }
      return localize(
        'A5E.SavingThrowPromptTitle',
        { name: actorDocument.name, ability: localize(CONFIG.A5E.abilities[abilityKey]) }
      );
    }

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
