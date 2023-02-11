// eslint-disable-next-line import/no-unresolved
import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';

import ConditionImmunitiesConfigComponent from '../ConditionImmunitiesConfigDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class ConditionImmunitiesConfigDialog extends TJSDialog {
  constructor(actorDocument) {
    super({
      title: game.i18n.format('A5E.ConditionImmunitiesConfigurationPrompt', { name: actorDocument.name }),
      content: {
        class: ConditionImmunitiesConfigComponent,
        props: { actorDocument }
      }
    }, {
      classes: ['a5e-sheet'],
      width: 420
    });
  }
}
