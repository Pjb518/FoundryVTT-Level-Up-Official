import { mount } from "svelte";

import A5eTokenHUD from "../apps/hud/A5ETokenHUD.svelte";

export default function renderNimbleTokenHUD(HUD, html, token) {
  const target = html.querySelector(".palette, .status-effects");
  if (!target) return;

  target.innerHTML = "";
  HUD._svelteComponent = mount(A5eTokenHUD, {
    target,
    props: { HUD, token },
  });
}
