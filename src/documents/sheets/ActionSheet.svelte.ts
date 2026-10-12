import { SvelteApplicationMixin } from '#lib/ApplicationMixin/SvelteApplicationMixin.svelte.ts';
import type { Action } from '#types/action.js';

import ActionSheetComponent from '#view/sheets/ActionSheet.svelte';

export class ActionSheet extends SvelteApplicationMixin(foundry.applications.api.ApplicationV2) {
	actionId: string;

	action: Action;

	actor?: Actor;

	item: Item;

	protected root = ActionSheetComponent;

	constructor(item: Item, actionId: string, actor?: Actor, options = {}) {
		const scale = Math.max((game.settings.get('core', 'uiConfig')?.fontScale ?? 5) / 5, 1);
		const width = ActionSheet.DEFAULT_OPTIONS.position.width * scale;
		//
		// @ts-expect-error
		super({
			classes: ['a5e-sheet', 'a5e-sheet--action'],
			position: { width, height: 592 },
			window: { resizable: true },
		});

		this.item = item;
		this.actionId = actionId;
		this.actor = actor;
	}

	static override DEFAULT_OPTIONS = {
		baseApplication: 'ActionSheet',
		classes: ['a5e-sheet', 'a5e-sheet--action'],
		position: { width: 555, height: 592 },
		window: {
			resizable: true,
			minimizable: true,
		},
	};

	get title() {
		const title = 'Action: ';
		return `${title} ${this.action?.name || 'New Action'}`;
	}

	protected override async _prepareContext() {
		return {
			action: this.action,
			actionId: this.actionId,
			item: this.item,
			actor: this.actor,
			sheet: this,
		};
	}
}
