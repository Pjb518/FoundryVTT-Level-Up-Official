import { mount } from 'svelte';
import A5EEffectsPanel from '#view/huds/A5EEffectsPanel.svelte';

let effectsPanelInstance = null;

function renderEffectsPanel() {
  const target = document.body.querySelector("#ui-right");
  if (!target) return;

  // Unmount existing instance if it exists
  if (effectsPanelInstance) {
    effectsPanelInstance.unmount();
  }

  effectsPanelInstance = mount(A5EEffectsPanel, { target });
}

export default function canvasReady() {
  // Render Effects Panel

  if (game.settings.get("a5e", "showEffectsPanel") ?? true) {
    renderEffectsPanel();
  }
}
