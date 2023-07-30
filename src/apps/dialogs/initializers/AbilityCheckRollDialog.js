import { localize } from '#runtime/svelte/helper';
import { TJSDialog } from '#runtime/svelte/application';

import AbilityCheckRollDialogComponent from '../AbilityCheckRollDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class AbilityCheckRollDialog extends TJSDialog {
  constructor(actorDocument, abilityKey, options) {
    super({
      title: localize(
        'A5E.AbilityCheckPromptTitle',
        { name: actorDocument.name, ability: localize(CONFIG.A5E.abilities[abilityKey]) }
      ),
      content: {
        class: AbilityCheckRollDialogComponent,
        props: { actorDocument, abilityKey, options }
      }
    }, {
      classes: ['a5e-sheet'],
      width: 420
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
