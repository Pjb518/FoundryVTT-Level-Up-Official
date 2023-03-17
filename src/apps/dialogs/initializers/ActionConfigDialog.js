// eslint-disable-next-line import/no-unresolved
import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';

import ActionConfigDialogComponent from '../ActionConfigDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class ActionConfigDialog extends TJSDialog {
  constructor(itemDocument, actionId, actionName) {
    super({
      title: actionName,
      content: {
        class: ActionConfigDialogComponent,
        props: { actionId, itemDocument }
      }
    }, {
      classes: ['a5e-sheet'],
      width: 555,
      height: 592
    });

    this.data.content.props.dialog = this;
  }
}
