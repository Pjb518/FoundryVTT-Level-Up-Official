// eslint-disable-next-line import/no-unresolved
import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';

import DamageVulnerabilitiesConfigComponent from '../DamageVulnerabilitiesConfigDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class DamageVulnerabilitiesConfigDialog extends TJSDialog {
  constructor(actorDocument) {
    super({
      title: game.i18n.format('A5E.DamageVulnerabilitiesConfigurationPrompt', { name: actorDocument.name }),
      content: {
        class: DamageVulnerabilitiesConfigComponent,
        props: { actorDocument }
      }
    }, {
      classes: ['a5e-sheet'],
      width: 420
    });
  }
}
