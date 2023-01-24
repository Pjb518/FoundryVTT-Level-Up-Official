// eslint-disable-next-line import/no-unresolved
import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';
import LanguagesConfigComponent from '../LanguagesConfigDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class LanguagesConfigDialog extends TJSDialog {
  constructor(actor) {
    super({
      title: 'Languages Config',
      content: {
        class: LanguagesConfigComponent,
        props: { actor }
      }
    }, {
      classes: ['a5e-sheet'],
      width: 420
    });
  }
}
