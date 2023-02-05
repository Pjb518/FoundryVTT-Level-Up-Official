// eslint-disable-next-line import/no-unresolved
import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';
import ArmorProfConfigComponent from '../ArmorProfConfigDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class ArmorProfConfigDialog extends TJSDialog {
  constructor(actor) {
    super({
      title: 'Armor Proficiencies Config',
      content: {
        class: ArmorProfConfigComponent,
        props: { actor }
      }
    }, {
      classes: ['a5e-sheet'],
      width: 420
    });
  }
}
