import { SvelteApplicationMixin } from '#lib/ApplicationMixin/SvelteApplicationMixin.svelte.ts';

import Component from '../HelpAndSupportDialog.svelte';

export class HelpAndSupportDialog extends SvelteApplicationMixin(
	foundry.applications.api.ApplicationV2,
) {
	root = Component;

	constructor() {
		// @ts-expect-error
		super({
			classes: ['a5e-help-and-support-dialog'],
			position: { width: 400, height: 'auto' },
			window: {
				title: 'Help and Support',
				resizable: true,
			},
		});
	}

	static override DEFAULT_OPTIONS = {
		classes: ['a5e-help-and-support-dialog'],
		position: { width: 400, height: 'auto' },
		window: { resizable: true },
	};

	async _prepareContext() {
		return { dialog: this };
	}
}
