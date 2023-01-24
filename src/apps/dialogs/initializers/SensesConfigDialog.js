// eslint-disable-next-line import/no-unresolved
import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';
import SensesConfigComponent from '../SensesConfigDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class SensesConfigDialog extends TJSDialog {
  constructor(actor) {
    super({
      title: 'Senses Config',
      content: {
        class: SensesConfigComponent,
        props: { actor }
      }
    }, {
      classes: ['a5e-sheet'],
      width: 420
    });
  }
}
