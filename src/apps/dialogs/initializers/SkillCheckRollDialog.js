// eslint-disable-next-line import/no-unresolved
import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';

import SkillCheckRollDialogComponent from '../SkillCheckRollDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class SkillCheckRollDialog extends TJSDialog {
  constructor(actorDocument, skillKey) {
    super({
      title: game.i18n.format(
        'A5E.SkillPromptTitle',
        { name: actorDocument.name, skill: game.i18n.localize(CONFIG.A5E.skills[skillKey]) }
      ),
      content: {
        class: SkillCheckRollDialogComponent,
        props: { actorDocument, skillKey }
      }
    }, {
      classes: ['a5e-sheet'],
      width: 433
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
