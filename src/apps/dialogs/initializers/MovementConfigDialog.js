// eslint-disable-next-line import/no-unresolved
import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';
import MovementConfigComponent from '../MovementConfigDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class MovementConfigDialog extends TJSDialog {
  constructor(actor) {
    super({
      title: 'Movement Config',
      content: {
        class: MovementConfigComponent,
        props: { actor }
      }
    }, {
      classes: ['a5e-sheet'],
      width: 420
    });
  }
}
