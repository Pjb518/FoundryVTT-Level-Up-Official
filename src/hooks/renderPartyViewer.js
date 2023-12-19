import PartyViewer from '../apps/PartyViewer';

export default function renderPartyViewer(hotkey = false) {
  if (hotkey && game.a5e.dialogs.partyViewer?.rendered) {
    game.a5e.dialogs?.partyViewer?.close();
    return;
  }

  game.a5e.dialogs.partyViewer ??= new PartyViewer();
  game.a5e.dialogs.partyViewer.render(true);
}
