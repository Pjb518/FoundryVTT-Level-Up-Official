import A5EEffectsPanel from '../apps/hud/A5EEffectsPanel.svelte';

function renderEffectsPanel() {
	const target = document.body.querySelector('#ui-right');
	if (!target) return;

	// eslint-disable-next-line no-new
	new A5EEffectsPanel({ target });
}

export default function canvasReady() {
	// Render Effects Panel

	if (game.settings.get('a5e', 'showEffectsPanel') ?? true) {
		renderEffectsPanel();
	}
}
