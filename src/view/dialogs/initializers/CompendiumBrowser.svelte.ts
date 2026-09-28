import { SvelteApplicationMixin } from '#lib/ApplicationMixin/SvelteApplicationMixin.svelte.ts';

import CompendiumBrowserComponent from '../compendium-browser/CompendiumBrowser.svelte';

export type CompendiumBrowserTab =
	| 'archetype'
	| 'background'
	| 'class'
	| 'culture'
	| 'destiny'
	| 'feature'
	| 'hacking'
	| 'heritage'
	| 'interaction'
	| 'maneuver'
	| 'npc'
	| 'monsterFeature'
	| 'object'
	| 'spell';

export interface CompendiumBrowserFilters {
	searchTerm?: string;
	searchDescription?: boolean;
	selections?: Record<string, any>;
}

export class CompendiumBrowser extends SvelteApplicationMixin(
	foundry.applications.api.ApplicationV2,
) {
	data: Record<string, any>;

	protected root: any;

	constructor(data: Record<string, any> = {}, options: Record<string, any> = {}) {
		options.position ??= {};
		const scale = Math.max((game.settings.get('core', 'uiConfig')?.fontScale ?? 5) / 5, 1);
		const width =
			(options.position.width ?? CompendiumBrowser.DEFAULT_OPTIONS.position.width) * scale;

		// @ts-expect-error
		super({
			classes: ['a5e-sheet', 'a5e-sheet--compendium-browser'],
			position: {
				width,
				height: options.height ?? 'auto',
			},
			window: { title: 'Compendium Browser' },
		});

		this.data = data;
		this.document = document;
		this.root = CompendiumBrowserComponent;
		this.#prepareData();
	}

	static override DEFAULT_OPTIONS = {
		classes: ['a5e-sheet', 'a5e-sheet--compendium-browser'],
		position: { width: 700, height: 'auto' },
	};

	override async _prepareContext() {
		return {
			...this.data,
		};
	}

	#prepareData() {}

	// -------------------------------------------------------------------------
	// Public helpers for modules / enrichers
	// -------------------------------------------------------------------------
	static openTo(tab: CompendiumBrowserTab): CompendiumBrowser {
		const browser = new CompendiumBrowser({ tab });
		browser.render(true);
		return browser;
	}
	static openWithFilters(
		tab: CompendiumBrowserTab,
		filters: CompendiumBrowserFilters,
	): CompendiumBrowser {
		const browser = new CompendiumBrowser({ tab, filters });
		browser.render(true);
		return browser;
	}
}
