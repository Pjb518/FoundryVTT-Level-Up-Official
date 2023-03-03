// eslint-disable-next-line import/no-unresolved
import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';
import RestDialogComponent from '../RestDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class RestDialogDialog extends TJSDialog {
  constructor(actorDocument) {
    super({
      title: `${actorDocument.name} - Rest`,
      content: {
        class: RestDialogComponent,
        props: { actorDocument }
      }
    }, {
      classes: ['a5e-sheet'],
      width: 420
    });
  }
}
