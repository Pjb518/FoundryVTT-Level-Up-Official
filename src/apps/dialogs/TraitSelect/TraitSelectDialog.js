// eslint-disable-next-line import/no-unresolved
import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';

import TraitSelectDialogComponent from './TraitSelectDialog.svelte';

/**
 * @typedef {{"label": string, "traits"?: {string: string}} TraitGroup A collection of identifying
 * information about a grouping of traits.
 * @property {string} TraitGroup.label The i18n string for the label of the group.
 * @property {{string: string}?} TraitGroup.traits An object map of the system name to i18n string,
 * omission of this element indicates this grouping is a custom data entry for the user.
 */

/**
 * Provides a dialog selecting from a generic use of traits.
 */
export default class TraitSelectDialog extends TJSDialog {
  /**
   * @param {string} title The title of the window, this string will be localized.
   * @param {[TraitGroup]} traitGroups The array of trait groupings. See `TraitGroup`
   * @param {Object} options
   * @param {[string]?} [options.selected] An array containing preselected traits
   * @param {[string]?} [options.disabled] When a trait name is included in the disabled array,
   * users will not be able to change the selection status.
   * @param {Integer?} [options.selectionLimit] When provided, the dialog will require the user to
   * select exactly the integer provided, and won't allow them to submit otherwise.
   */
  constructor(title, traitGroups, options) {
    if (!Array.isArray(traitGroups)) throw Error('TraitSelectDialog: traitGroups must be an array!');
    if (typeof title !== 'string') throw Error('TraitSelectDialog: title must be a string!');

    const props = {
      traitGroups,
      selected: [],
      disabled: []
    };

    if (options) {
      if (Array.isArray(options.selected)) props.selected = options.selected;
      if (Array.isArray(options.disabled)) props.disabled = options.disabled;
      if (Number.isInteger(options.selectionLimit)) props.selectionLimit = options.selectionLimit;
    }

    super({
      title: game.i18n.localize(title),
      content: {
        class: TraitSelectDialogComponent,
        props
      }
    }, { classes: ['a5e-sheet'], width: 480 });

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
