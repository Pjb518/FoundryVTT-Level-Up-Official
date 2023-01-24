// eslint-disable-next-line import/no-unresolved
import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';
import DamageVulnerabilitiesConfigComponent from '../DamageVulnerabilitiesConfigDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class DamageVulnerabilitiesConfigDialog extends TJSDialog {
  constructor(actor) {
    super({
      title: 'Damage Vulnerabilities Config',
      content: {
        class: DamageVulnerabilitiesConfigComponent,
        props: { actor }
      }
    }, {
      classes: ['a5e-sheet'],
      width: 420
    });
  }
}
