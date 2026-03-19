import { CompendiumBrowser } from "#view/dialogs/initializers/CompendiumBrowser.svelte.ts";
import renderPartyViewer from "./hooks/renderPartyViewer.ts";
import { SystemSettings } from "./settings/SystemSettings.svelte.ts";

export function registerKeybindings() {
  game.keybindings.register("a5e", "party-sheet-open-close", {
    name: "Open/Close Party Sheet",
    editable: [{ key: "KeyP" }],
    onDown: () => {
      if (
        //@ts-ignore
        !game.user.isGM &&
        !game.settings.get("a5e", "playersCanAccessPartyViewer")
      ) {
        return;
      }

      renderPartyViewer(true);
    },
  });

  game.keybindings.register("a5e", "system-settings-open-close", {
    name: "Open/Close System Settings",
    editable: [{ key: "KeyS", modifiers: ["Alt"] }],
    onDown: () => {
      new SystemSettings().render(true);
    },
  });

  game.keybindings.register("a5e", "compendium-browser-open-close", {
    name: "Open/Close Compendium Browser",
    editable: [{ key: "KeyC", modifiers: ["Alt"] }],
    onDown: () => {
      new CompendiumBrowser().render(true);
    },
  });
}
