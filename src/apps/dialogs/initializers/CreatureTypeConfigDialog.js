// eslint-disable-next-line import/no-unresolved
import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';
import CreatureTypeConfigComponent from '../CreatureTypeConfigDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class CreatureTypeConfigDialog extends TJSDialog {
  constructor(actor) {
    super({
      title: 'Creature Types Config',
      content: {
        class: CreatureTypeConfigComponent,
        props: { actor }
      }
    }, {
      classes: ['a5e-sheet'],
      width: 420
    });
  }
}
