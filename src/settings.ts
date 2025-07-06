// import SettingsShim from './settings/SettingsShim';
import { SystemSettings } from "./settings/SystemSettings.svelte.ts";

// import { gameSettings } from './settings/SettingsStore';
import { settings } from "./settings/settings.ts";

function parseAndRegisterSettings() {
  for (const setting of settings) {
    // @ts-ignore
    game.settings.register(setting.namespace, setting.key, setting.options);
  }
}

export default function registerSystemSettings() {
  // Parse and register settings
  parseAndRegisterSettings();

  // gameSettings.init();
  game.settings.registerMenu("a5e", "SystemSettings", {
    name: "System Settings",
    label: "Configure System Settings",
    icon: "fas fa bars",
    type: SystemSettings,
    restricted: false,
  });
}
