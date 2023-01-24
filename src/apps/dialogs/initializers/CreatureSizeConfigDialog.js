// eslint-disable-next-line import/no-unresolved
import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';
import CreatureSizeConfigComponent from '../CreatureSizeConfigDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class CreatureSizeConfigDialog extends TJSDialog {
  constructor(actor) {
    super({
      title: 'Creature Size Config',
      content: {
        class: CreatureSizeConfigComponent,
        props: { actor }
      }
    }, {
      classes: ['a5e-sheet'],
      width: 420
    });
  }
}
