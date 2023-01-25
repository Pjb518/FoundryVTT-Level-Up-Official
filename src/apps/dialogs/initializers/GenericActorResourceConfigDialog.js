// eslint-disable-next-line import/no-unresolved
import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';
import GenericActorResourceConfigComponent from '../GenericActorResourceConfigDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class GenericActorResourceConfigDialog extends TJSDialog {
  constructor(actor, source) {
    super({
      title: 'Generic Actor Resource Config',
      content: {
        class: GenericActorResourceConfigComponent,
        props: { actor, source }
      }
    }, {
      classes: ['a5e-sheet'],
      width: 420
    });
  }
}
