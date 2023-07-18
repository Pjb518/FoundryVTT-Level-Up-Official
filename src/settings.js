import SettingsShim from './settings/SettingsShim';

import { gameSettings } from './settings/SettingsStore';

export default function registerSystemSettings() {
  gameSettings.init();

  game.settings.registerMenu('a5e', 'SystemSettings', {
    name: 'System Settings',
    label: 'Configure System Settings',
    icon: 'fas fa bars',
    type: SettingsShim,
    restricted: true
  });
}
