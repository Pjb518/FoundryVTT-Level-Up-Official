// eslint-disable-next-line import/no-unresolved
import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';

import ArmorProfConfigComponent from '../ArmorProfConfigDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class ArmorProfConfigDialog extends TJSDialog {
  constructor(actorDocument) {
    super({
      title: game.i18n.format('A5E.ArmorProficienciesConfigurationPrompt', { name: actorDocument.name }),
      content: {
        class: ArmorProfConfigComponent,
        props: { actorDocument }
      }
    }, {
      classes: ['a5e-sheet'],
      width: 420
    });
  }
}
