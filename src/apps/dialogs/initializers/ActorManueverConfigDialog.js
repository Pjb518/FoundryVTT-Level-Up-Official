// eslint-disable-next-line import/no-unresolved
import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';
import ManueverConfigDialogComponent from '../ActorManueverConfigDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class ActorManueverConfigDialog extends TJSDialog {
  constructor(actor) {
    super({
      title: 'Manuever Config',
      content: {
        class: ManueverConfigDialogComponent,
        props: { actor }
      }
    }, {
      classes: ['a5e-sheet'],
      width: 420
    });
  }
}
