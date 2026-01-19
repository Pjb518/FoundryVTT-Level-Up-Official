import renderPartyViewer from './renderPartyViewer';

export default function setupPartyViewerButton() {
  Hooks.on('getSceneControlButtons', (controls) => {
    if (!game.settings.get("a5e", "playersCanAccessPartyViewer") && !game.user.isGM) {
      return;
    }

    controls.a5eTools = {
      name: 'a5eTools',
      title: 'A5E Tools',
      icon: 'fa-solid fa-toolbox',
      layer: 'a5eToolsLayer',
      activeTool: 'partyViewer',
      tools: {
        partyViewer: {
          name: 'partyViewer',
          title: 'Party Viewer',
          icon: 'fa-solid fa-users',
          button: true,
          onClick: () => {
            renderPartyViewer();
          }
        }
      }
    };
  });
}
