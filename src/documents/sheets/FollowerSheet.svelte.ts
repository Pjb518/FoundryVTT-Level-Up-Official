import { SvelteApplicationMixin } from '#lib/ApplicationMixin/SvelteApplicationMixin.svelte.ts';
import FollowerSheetComponent from '#view/sheets/FollowerSheet.svelte';

class FollowerSheetA5E extends SvelteApplicationMixin(foundry.applications.sheets.ActorSheetV2) {
	public follower: Actor.OfType<'follower'>;

	protected root = FollowerSheetComponent;

	constructor(actor: { document: Actor.OfType<'follower'> }, options: any = {}) {
		options.position ??= {};
		const scale = Math.max((game.settings.get('core', 'uiConfig')?.fontScale ?? 5) / 5, 1);
		options.position.width = FollowerSheetA5E.DEFAULT_OPTIONS.position.width * scale;

		super(
			// @ts-expect-error
			foundry.utils.mergeObject(options, {
				classes: ['a5e-sheet', 'a5e-sheet--follower'],
				document: actor.document,
				position: { width: 700, height: 'auto' },
				window: { resizable: true },
			}),
		);

		// @ts-expect-error
		this.follower = actor.document.isToken ? actor.document.parent?.actor : actor.document;
	}

	static override DEFAULT_OPTIONS = {
		baseApplication: 'ActorSheet',
		classes: ['a5e-sheet', 'a5e-sheet--follower'],
		position: { width: 700, height: 'auto' },
		window: { minimizable: true, resizable: true },
	};

	override async _onDropItem(event: DragEvent, item: Item) {
		if (!this.follower.isOwner) return null;
		if (item.type !== 'feature' || item.system.featureType !== 'followerFeature') return null;

		return super._onDropItem(event, item);
	}

	protected async _prepareContext() {
		return {
			follower: this.follower,
			sheet: this,
		};
	}
}

declare namespace FollowerSheetA5E {}

export { FollowerSheetA5E };
