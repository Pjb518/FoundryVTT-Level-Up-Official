import PartyViewer from '../apps/PartyViewer';

export default function renderPartyViewer(hotkey = false) {
  game.dialogs ??= {};

  if (hotkey && game.dialogs.partyViewer) {
    game.dialogs?.partyViewer?.close();
    return;
  }

  game.dialogs.partyViewer ??= new PartyViewer();
  game.dialogs.partyViewer.render(true);
}
