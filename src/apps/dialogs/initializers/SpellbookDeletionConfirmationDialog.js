import { TJSDialog } from '#runtime/svelte/application';

import SpellbookDeletionConfirmationDialogComponent from '../SpellbookDeletionConfirmationDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class SpellbookDeletionConfirmationDialog extends TJSDialog {
	constructor() {
		super(
			{
				title: 'Confirm Spellbook Deletion',
				content: {
					class: SpellbookDeletionConfirmationDialogComponent,
					props: {},
				},
			},
			{
				classes: ['a5e-sheet'],
				width: 420,
			},
		);

		this.data.content.props.dialog = this;

		this.promise = new Promise((resolve) => {
			this.resolve = resolve;
		});
	}

	/** @inheritdoc */
	close(options) {
		this.#resolvePromise(null);
		return super.close(options);
	}

	/**
	 * Resolves the dialog's promise and closes it.
	 *
	 * @param {object} results
	 * @returns
	 */
	submit(results) {
		this.#resolvePromise(results);
		return super.close();
	}

	#resolvePromise(data) {
		if (this.resolve) {
			this.resolve(data);
		}
	}
}
