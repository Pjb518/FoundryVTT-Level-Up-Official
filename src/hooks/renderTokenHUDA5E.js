import A5eTokenHUD from '../apps/hud/A5ETokenHUD.svelte';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function renderTokenHUDA5E(HUD, html, token) {
  const target = $(html).find('.status-effects')[0];
  if (!target) return;

  target.innerHTML = '';
  HUD._svelteComponent = new A5eTokenHUD({
    target,
    props: { HUD }
  });
}
