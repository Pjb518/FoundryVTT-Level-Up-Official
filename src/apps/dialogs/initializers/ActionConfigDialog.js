// eslint-disable-next-line import/no-unresolved
import { TJSDialog } from '#runtime/svelte/application';

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
      },
      zIndex: null
    }, {
      classes: ['a5e-sheet', 'a5e-sheet--action'],
      width: 555,
      height: 592,
      resizable: true
    });

    this.data.content.props.dialog = this;
  }
}
