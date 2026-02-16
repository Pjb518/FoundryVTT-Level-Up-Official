import renderPartyViewer from './renderPartyViewer';

export default function setupPartyViewerButton() {
  Hooks.on('getSceneControlButtons', (controls) => {
    if (!game.settings.get("a5e", "playersCanAccessPartyViewer") && !game.user.isGM) {
      return;
    }

    // Initialize if it doesn't exist
    if (!controls.a5eTools) {
      controls.a5eTools = {
        name: 'a5eTools',
        title: 'A5E Tools',
        icon: 'fa-solid fa-toolbox',
        layer: 'a5eTools',  // Now this custom layer exists
        tools: {}
      };
    }

    // Add party viewer as a tool
    controls.a5eTools.tools.partyViewer = {
      name: 'partyViewer',
      title: 'Party Viewer',
      icon: 'fa-solid fa-users',
      button: true,
      onClick: () => {
        renderPartyViewer();
      }
    };

    // Set activeTool if not already set
    if (!controls.a5eTools.activeTool) {
      controls.a5eTools.activeTool = 'partyViewer';
    }
  });
}
