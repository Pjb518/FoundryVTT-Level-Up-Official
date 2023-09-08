import { localize } from '#runtime/svelte/helper';
import { TJSDialog } from '#runtime/svelte/application';
import { TJSLiveGameSettings } from '#runtime/svelte/store/fvtt/settings';

import PartyViewerComponent from './sheets/PartyViewer.svelte';

import { gameSettings } from '../settings/SettingsStore';

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
      }
    }, {
      classes: ['a5e-sheet'],
      width: 600
    });

    this.data.content.props.sheet = this;
  }
}
