import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';
import ActionConfigDialogComponent from './dialogs/ActionConfigDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class ActionConfigDialog extends TJSDialog {
  constructor(item, actionId, actionName) {
    super({
      title: actionName,
      content: {
        class: ActionConfigDialogComponent,
        props: { actionId, item }
      }
    }, { classes: ['a5e-sheet'], width: 512, height: 540 });
  }
}
