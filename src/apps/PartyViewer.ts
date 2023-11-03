import { localize } from '#runtime/svelte/helper';
import { TJSDialog } from '#runtime/svelte/application';

import { gameSettings } from '../settings/SettingsStore';

import PartyViewerComponent from './sheets/PartyViewer.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class PartyViewer extends TJSDialog {
  constructor() {
    super({
      title: localize('Party Viewer'),
      content: {
        class: PartyViewerComponent,
        props: {
          settings: gameSettings
        }
      },
      resizable: true,
      zIndex: null
    }, {
      classes: ['a5e-sheet', 'a5e-sheet--party-viewer'],
      width: 672
    });

    this.data.content.props.sheet = this;
  }

  close() {
    game.dialogs.partyViewer = null;
    super.close();
  }
}
