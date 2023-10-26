import renderPartyViewer from './hooks/renderPartyViewer';
import SystemSettings from './settings/SystemSettings';

export default function registerKeybindings() {
  game.keybindings.register('a5e', 'party-sheet-open-close', {
    name: 'Open/Close Party Sheet',
    editable: [{ key: 'KeyP' }],
    onDown: () => {
      if (!game.user.isGM && !game.settings.get('a5e', 'playersCanAccessPartyViewer')) {
        return;
      }

      renderPartyViewer(true);
    }
  });

  game.keybindings.register('a5e', 'system-settings-open-close', {
    name: 'Open/Close System Settings',
    editable: [{ key: 'KeyS', modifiers: ['Alt'] }],
    onDown: () => {
      SystemSettings.show();
    }
  });
}
