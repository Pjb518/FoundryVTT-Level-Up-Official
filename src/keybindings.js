import renderPartyViewer from './hooks/renderPartyViewer';

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
}
