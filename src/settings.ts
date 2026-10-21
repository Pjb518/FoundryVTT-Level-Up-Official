import { SystemSettings } from './settings/SystemSettings.svelte.ts';
import { settings } from './settings/settings.ts';
import { ThemeSettings } from './settings/ThemeSettings.svelte.ts';

function parseAndRegisterSettings() {
	for (const setting of settings) {
		// @ts-expect-error
		game.settings.register(setting.namespace, setting.key, setting.options);
	}
}

export default function registerSystemSettings() {
	// Parse and register settings
	parseAndRegisterSettings();

	game.settings.registerMenu('a5e', 'SystemSettings', {
		name: 'System Settings',
		label: 'Configure System Settings',
		icon: 'fas fa-bars',
		// @ts-expect-error
		type: SystemSettings,
		restricted: false,
	});

	game.settings.registerMenu('a5e', 'ThemeSettings', {
		name: 'Theme Settings',
		label: 'Configure Theme Settings',
		hint: '',
		icon: 'fas fa-palette',
		type: ThemeSettings,
		restricted: false,
	});
}
