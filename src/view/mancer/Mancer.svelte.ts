import { SvelteApplicationMixin } from '#lib/ApplicationMixin/SvelteApplicationMixin.svelte.ts';
import MancerComponent from './Mancer.svelte';

export class MancerDialog extends SvelteApplicationMixin(foundry.applications.api.ApplicationV2) {
	protected root = MancerComponent;

	document: Character;

	constructor(document: Character) {
		super(
			foundry.utils.mergeObject(MancerDialog.DEFAULT_OPTIONS, {
				window: { title: `Mancer - ${document.name}` },
			}),
		);

		this.document = document;
	}

	static override DEFAULT_OPTIONS = {
		classes: ['a5e-sheet', 'a5e-sheet--mancer'],
		position: { width: 895, height: 710 },
		window: { resizable: true },
	};

	protected override async _prepareContext() {
		const charOptions = this.#getCharOptions();

		return {
			actor: this.document,
			charOptions: charOptions,
			sheet: this,
		};
	}

	#getCharOptions(type: string) {
		const documents = {
			archetype: [] as any[],
			background: [] as any[],
			class: [] as any[],
			culture: [] as any[],
			destiny: [] as any[],
			heritage: [] as any[],
		};

		for (const pack of game.packs) {
			for (const doc of pack.index) {
				// Add document to documents if valid
				const type = doc.type;
				if (documents[type]) documents[type].push(doc);
			}
		}

		return documents;
	}
}
