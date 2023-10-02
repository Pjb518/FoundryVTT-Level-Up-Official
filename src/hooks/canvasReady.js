import A5EEffectsPanel from '../apps/hud/A5EEffectsPanel.svelte';

function renderEffectsPanel() {
  const target = document.body.querySelector('#ui-right');
  if (!target) return;

  const panel = new A5EEffectsPanel({
    target
  });
}

export default function canvasReady() {
  // Render Effects Panel
  // game.a5e.activeEffects.effectsPanel.render(true);
  renderEffectsPanel();
}
