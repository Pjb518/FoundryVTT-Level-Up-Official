// eslint-disable-next-line import/no-unresolved
import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';
import DamageImmunitiesConfigComponent from '../DamageImmunitiesConfigDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class DamageImmunitiesConfigDialog extends TJSDialog {
  constructor(actor) {
    super({
      title: 'Damage Immunities Config',
      content: {
        class: DamageImmunitiesConfigComponent,
        props: { actor }
      }
    }, {
      classes: ['a5e-sheet'],
      width: 420
    });
  }
}
