// eslint-disable-next-line import/no-unresolved
import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';

import DamageResistancesConfigComponent from '../DamageResistancesConfigDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class DamageResistancesConfigDialog extends TJSDialog {
  constructor(actorDocument) {
    super({
      title: game.i18n.format('A5E.DamageResistancesConfigurationPrompt', { name: actorDocument.name }),
      content: {
        class: DamageResistancesConfigComponent,
        props: { actorDocument }
      }
    }, {
      classes: ['a5e-sheet'],
      width: 420
    });
  }
}
