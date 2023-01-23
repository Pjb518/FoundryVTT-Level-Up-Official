// eslint-disable-next-line import/no-unresolved
import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';
import HpConfigComponent from '../ActorHpConfigDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class ActorHpConfigDialog extends TJSDialog {
  constructor(actor) {
    super({
      title: 'HP Config',
      content: {
        class: HpConfigComponent,
        props: { actor }
      }
    }, {
      classes: ['a5e-sheet'],
      width: 420
    });
  }
}
