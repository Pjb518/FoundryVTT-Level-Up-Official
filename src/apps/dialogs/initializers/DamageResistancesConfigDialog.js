// eslint-disable-next-line import/no-unresolved
import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';
import DamageResistancesConfigComponent from '../DamageResistancesConfigDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class DamageResistancesConfigDialog extends TJSDialog {
  constructor(actor) {
    super({
      title: 'Damage Resistances Config',
      content: {
        class: DamageResistancesConfigComponent,
        props: { actor }
      }
    }, {
      classes: ['a5e-sheet'],
      width: 420
    });
  }
}
