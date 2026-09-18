import { SvelteApplicationMixin } from '#lib/ApplicationMixin/SvelteApplicationMixin.svelte.ts';
import { type PartySheetStoreData, partySheetStore } from '#stores/PartySheetStore.svelte.ts';
import PartySheetComponent from '#view/sheets/PartySheet.svelte';

class PartySheetA5E extends SvelteApplicationMixin(foundry.applications.sheets.ActorSheetV2) {
	public actor: Actor.OfType<'party'>;

	public tempSettings: PartySheetStoreData = $derived({});

	protected root = PartySheetComponent;

	constructor(actor: { document: Actor.OfType<'party'> }, options: any = {}) {
		super(
			// @ts-expect-error
			foundry.utils.mergeObject(options, {
				classes: ['a5e-sheet, a5e-sheet--party'],
				document: actor.document,
				position: { width: 700, height: 'auto' },
				window: { resizable: true },
			}),
		);

		// @ts-expect-error
		this.actor = actor.document.isToken ? actor.document.parent?.actor : actor.document;

		partySheetStore[this.actor.uuid!] ??= {};
		this.tempSettings = partySheetStore[this.actor.uuid!];
	}

	static override DEFAULT_OPTIONS = {
		baseApplication: 'ActorSheet',
		classes: ['a5e-sheet', 'a5e-sheet--party'],
		position: { width: 700, height: 'auto' },
		window: { minimizable: true, resizable: true },
	};

	protected async _prepareContext() {
		return {
			party: this.actor,
			sheet: this,
		};
	}
}

declare namespace PartySheetA5E {}

export { PartySheetA5E };
