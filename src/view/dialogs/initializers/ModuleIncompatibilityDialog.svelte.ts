import { SvelteApplicationMixin } from '#lib/ApplicationMixin/SvelteApplicationMixin.svelte.ts';

import Component from '../ModuleIncompatibilityDialog.svelte';

type IncompatibilityPriority = 'low' | 'medium' | 'high';
type ActiveIncompatibleModules = [string, { reason: string; priority: IncompatibilityPriority }][];

/**
 * Warns the GM about active modules whose content is now redundant with the system, with a
 * "Deactivate All" action.
 */
export class ModuleIncompatibilityDialog extends SvelteApplicationMixin(
	foundry.applications.api.ApplicationV2,
) {
	data;

	root = Component;

	constructor(activeIncompatibleModules: ActiveIncompatibleModules) {
		//@ts-expect-error
		super({
			classes: ['a5e-sheet', 'a5e-sheet--announcement'],
			position: { width: 540, height: 'auto' },
			window: {
				title: 'Module Notices',
			},
		});

		this.data = { activeIncompatibleModules };

		this.promise = new Promise((resolve) => {
			this.resolve = resolve;
		});
	}

	async _prepareContext() {
		return {
			...this.data,
			dialog: this,
		};
	}

	/** @inheritdoc */
	close(options) {
		this.#resolvePromise(null);
		return super.close(options);
	}

	/**
	 * Resolves the dialog's promise and closes it.
	 * @returns
	 */
	submit(results: any) {
		this.#resolvePromise(results);
		return super.close();
	}

	#resolvePromise(data: any) {
		if (this.resolve) {
			this.resolve(data);
		}
	}
}
