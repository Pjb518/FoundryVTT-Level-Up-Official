import { SvelteApplicationMixin } from '#lib/ApplicationMixin/SvelteApplicationMixin.svelte.ts';

import Component from '../PremiumContentListDialog.svelte';

export class PremiumContentListDialog extends SvelteApplicationMixin(
	foundry.applications.api.ApplicationV2,
) {
	root = Component;

	constructor() {
		// @ts-expect-error
		super({
			classes: ['a5e-premium-content-list-dialog'],
			position: { width: 500, height: 'auto' },
			window: {
				title: 'Premium Content',
				resizable: true,
			},
		});
	}

	static override DEFAULT_OPTIONS = {
		classes: ['a5e-premium-content-list-dialog'],
		position: { width: 500, height: 'auto' },
		window: { resizable: true },
	};

	async _prepareContext() {
		return { dialog: this };
	}
}
