// eslint-disable-next-line import/no-unresolved
import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';

import isCustomLanguage from '../../utils/isCustomLanguage';
import LanguageSelectDialogComponent from './LanguageSelectDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class LanguageSelectDialog extends TJSDialog {
  _selected = [];

  _disabled = [];

  constructor(options) {
    super({
      title: 'Select Languages',
      content: {
        class: LanguageSelectDialogComponent,
        props: {
        }
      }
    }, { classes: ['a5e-sheet'], width: 480 });

    if (Array.isArray(options?.languages)) this._selected = options.languages;
    if (Array.isArray(options?.disabled)) this._disabled = options.disabled;

    this.promise = new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  /**
   *
   * @param {[:string]} selected A list of languages to preselect
   * @param {[:string]} disabled A list of languages which to disable
   * @returns
   */
  getLanguages() {
    const core = [];

    Object.entries(CONFIG.A5E.languages).forEach((element) => {
      core.push({
        value: element[0],
        name: game.i18n.localize(element[1]),
        selected: this._selected.includes(element[0]),
        disabled: this._disabled.includes(element[0])
      });
    });

    const custom = [];
    this._selected.forEach((lang) => {
      if (isCustomLanguage(lang)) {
        custom.push(lang);
      }
    });

    return {
      core,
      custom: custom.join(';')
    };
  }

  close(options) {
    this.resolvePromise(null);
    return super.close(options);
  }

  resolvePromise(data) {
    if (this.resolve) {
      this.resolve(data);
    }
  }

  submit(data) {
    const results = [];
    data.core.forEach((lang) => { if (lang.selected) results.push(lang.value); });
    data.custom.split(';').forEach((l) => {
      const lang = l.trim();
      if (lang !== '' && !results.includes(lang)) {
        results.push(lang);
      }
    });
    this.resolvePromise(results);
    return super.close();
  }
}
