// eslint-disable-next-line import/no-unresolved
import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';

import CreatureTypeConfigComponent from '../CreatureTypeConfigDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class CreatureTypeConfigDialog extends TJSDialog {
  constructor(actorDocument) {
    super({
      title: game.i18n.format('A5E.CreatureTypesConfigurationPrompt', { name: actorDocument.name }),
      content: {
        class: CreatureTypeConfigComponent,
        props: { actorDocument }
      }
    }, {
      classes: ['a5e-sheet'],
      width: 420
    });
  }
}
