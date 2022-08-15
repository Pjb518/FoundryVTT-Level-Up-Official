import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';
import ActionConfigDialogComponent from './base/ActionConfigDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class ActionConfigDialog extends TJSDialog {
  constructor(
    item,
    action
  ) {
    super({
      title: 'Test',
      content: {
        class: ActionConfigDialogComponent,
        props: { item, action }
      }
    }, { width: 320, height: 200 });
  }
}
