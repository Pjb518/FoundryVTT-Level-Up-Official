// eslint-disable-next-line import/no-unresolved
import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';

import CreatureSizeConfigComponent from '../CreatureSizeConfigDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class CreatureSizeConfigDialog extends TJSDialog {
  constructor(actorDocument) {
    super({
      title: game.i18n.format('A5E.SizeCategoryConfigurationPrompt', { name: actorDocument.name }),
      content: {
        class: CreatureSizeConfigComponent,
        props: { actorDocument }
      }
    }, {
      classes: ['a5e-sheet'],
      width: 420
    });
  }
}
