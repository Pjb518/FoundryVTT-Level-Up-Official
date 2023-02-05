// eslint-disable-next-line import/no-unresolved
import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';
import InitiativeConfigComponent from '../ActorInitConfigDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class ActorInitConfigDialog extends TJSDialog {
  constructor(actor) {
    super({
      title: 'Initiative Config',
      content: {
        class: InitiativeConfigComponent,
        props: { actor }
      }
    }, {
      classes: ['a5e-sheet'],
      width: 420
    });
  }
}
