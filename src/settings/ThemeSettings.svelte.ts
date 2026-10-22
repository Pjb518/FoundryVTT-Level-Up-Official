import { MappingField } from '#data/fields/MappingField.ts';
import { SvelteApplicationMixin } from '#lib/ApplicationMixin/SvelteApplicationMixin.svelte.ts';
import ThemeSettingsComponent from '#view/settings/ThemeSettings.svelte';

import fields = foundry.data.fields;

export const schema = () => ({
	currentTheme: new fields.StringField({ required: true, nullable: false, initial: 'default' }),
	themes: new MappingField(
		new fields.SchemaField({
			primaryColor: new fields.ColorField({
				required: true,
				nullable: false,
				initial: '#426066',
				label: 'Primary Color',
			}),
		}),
		{ initialKeys: ['default'] },
	),
});

class ThemeSettings extends SvelteApplicationMixin(foundry.applications.api.ApplicationV2) {
	/** Variable mappings */
	static VAR_MAPPINGS = {
		primaryColor: '--a5e-color-primary',
	};

	VAR_MAPPINGS = ThemeSettings.VAR_MAPPINGS;

	config: ThemeSettings.Config;

	root = ThemeSettingsComponent;

	constructor() {
		super({
			id: 'a5e-theme-settings',
			classes: ['a5e-sheet', 'a5e-sheet--settings'],
			position: { width: 650, height: 'auto' },
			window: { title: _loc('A5E.settings.title') },
		});

		this.config = game.settings.get('a5e', 'themeSettings');
	}

	async _prepareContext() {
		return {
			config: this.config,
			mappings: this.VAR_MAPPINGS,
			fields: this.prepareSettingsData(),
			dialog: this,
		};
	}

	prepareSettingsData() {
		const settings = game.settings.settings.get('a5e.themeSettings')!;

		// @ts-expect-error
		const themeFields = settings.type.fields.themes.element.fields;

		const data = Object.entries(themeFields ?? {}).map(
			// @ts-expect-error
			([key, field]: [string, fields.DataField]) => {
				return {
					key,
					label: field.label,
					field,
				};
			},
		);

		return data;
	}

	static getActiveApp(): ThemeSettings {
		// @ts-expect-error
		return Object.values(ui.windows).find((app) => app.id === 'a5e-theme-settings');
	}

	static async show(options = {}, dialogData = {}) {
		const app = this.getActiveApp();
		// @ts-expect-error
		if (app) return app.render(false, { focus: true });

		return new Promise((resolve) => {
			// @ts-expect-error
			options.resolve = resolve;

			// @ts-expect-error
			new this(options, dialogData).render(true, { focus: true });
		});
	}

	/** @inheritdoc */
	override close(options) {
		// Reset variables
		ThemeSettings.applyGlobalTheme();

		return super.close(options);
	}

	/** Apply Selected themes on startup */
	static applyGlobalTheme() {
		const lightTheme = document.querySelector<HTMLElement>('.theme-light');
		const darkTheme = document.querySelector<HTMLElement>('.theme-dark');
		const themeSettings = game.settings.get('a5e', 'themeSettings');

		const currentTheme = themeSettings.themes[themeSettings.currentTheme] ?? {};

		Object.entries(this.VAR_MAPPINGS ?? {}).forEach(([key, variable]) => {
			let value = currentTheme[key];
			if (value === null || value === undefined) return;

			// Convert number string values to strings
			if (value instanceof Color) value = value.toString();

			document.documentElement.style.setProperty(variable, value);
			if (lightTheme) lightTheme.style.setProperty(variable, value);
			if (darkTheme) darkTheme.style.setProperty(variable, value);
		});
	}
}

type InitializedField<T extends fields.DataField> = ReturnType<T['getInitialValue']>;

declare namespace ThemeSettings {
	type Config = {
		// @ts-expect-error
		[K in keyof ReturnType<typeof schema>]: InitializedField<ReturnType<typeof schema>[K]>;
	};
}

export { ThemeSettings };
