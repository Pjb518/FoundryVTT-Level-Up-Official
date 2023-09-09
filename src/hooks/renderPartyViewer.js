import PartyViewer from '../apps/PartyViewer';

export default function renderPartyViewer() {
  game.dialogs ??= {};
  game.dialogs.partyViewer ??= new PartyViewer();

  game.dialogs.partyViewer.render(true);
}
