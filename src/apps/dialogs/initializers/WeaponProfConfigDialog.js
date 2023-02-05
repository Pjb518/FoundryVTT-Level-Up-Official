// eslint-disable-next-line import/no-unresolved
import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';
import WeaponProfConfigComponent from '../WeaponProfConfigDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class WeaponProfConfigDialog extends TJSDialog {
  constructor(actor) {
    super({
      title: 'Weapon Proficiencies Config',
      content: {
        class: WeaponProfConfigComponent,
        props: { actor }
      }
    }, {
      classes: ['a5e-sheet'],
      width: 420
    });
  }
}
