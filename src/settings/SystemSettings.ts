import { localize } from '#runtime/util/i18n';
import { SvelteApplication } from '#runtime/svelte/application';

import { gameSettings } from './SettingsStore';

import SystemSettingsComponent from '../apps/settings/SystemSettings.svelte';

export default class SystemSettings extends SvelteApplication {
	public promise = null;

	public resolve = null;

	constructor(options = {}, dialogData = {}) {
		super(
			{
				id: 'a5e-system-settings',
				title: localize('A5E.settings.title'),
				svelte: {
					class: SystemSettingsComponent,
					target: document.body,
					props: {
						settings: gameSettings,
					},
				},
				width: 600,
				height: 'auto',
				...options,
				// @ts-expect-error
			},
			{ dialogData },
		);

		// @ts-ignore
		this.options.svelte.props.dialog = this;

		// @ts-expect-error
		this.promise = new Promise((resolve) => {
			// @ts-expect-error
			this.resolve = resolve;
		});
	}

	/**
	 * Default Application options
	 *
	 * @returns {object} options - Application options.
	 * @see https://foundryvtt.com/api/interfaces/client.ApplicationOptions.html
	 */
	static get defaultOptions() {
		// @ts-expect-error
		return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ['a5e-sheet', 'a5e-settings-sheet'],
			minimizable: true,
			svelte: {
				target: document.body,
			},
			token: null,
		});
	}

	static getActiveApp(): SystemSettings {
		// @ts-ignore
		return Object.values(ui.windows).find((app) => app.id === 'a5e-system-settings');
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

	submit(results) {
		this.#resolvePromise(results);

		if (results.reload) {
			foundry.utils.debounce(() => window.location.reload(), 250)();
		}

		// @ts-expect-error
		return super.close();
	}

	#resolvePromise(data): void {
		if (this.resolve) {
			// @ts-expect-error
			this.resolve(data);
		}
	}
}
