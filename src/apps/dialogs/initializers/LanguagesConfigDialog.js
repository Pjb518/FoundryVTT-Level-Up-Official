// eslint-disable-next-line import/no-unresolved
import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';

import LanguagesConfigComponent from '../LanguagesConfigDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class LanguagesConfigDialog extends TJSDialog {
  constructor(actorDocument) {
    super({
      title: game.i18n.format('A5E.LanguagesConfigurationPrompt', { name: actorDocument.name }),
      content: {
        class: LanguagesConfigComponent,
        props: { actorDocument }
      }
    }, {
      classes: ['a5e-sheet'],
      width: 420
    });
  }
}
