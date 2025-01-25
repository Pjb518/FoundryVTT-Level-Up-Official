import { TJSDialog } from '#runtime/svelte/application';
import { TJSDocument } from '#runtime/svelte/store/fvtt/document';

import ItemDocument from '../../ItemDocument';

/**
 * Provides a dialog for creating documents that by default is modal and not resizable.
 */
export default class GenericConfigDialog extends TJSDialog {
	constructor(document, title, component, data = {}, options = {}) {
		// TODO: Refactor - Revisit this to see if this is what we wanna do
		const doc = options.isItemDocument ? new ItemDocument(document) : new TJSDocument(document);
		delete options.isItemDocument;

		super(
			{
				title,
				content: {
					class: component,
					props: { document: doc, ...data },
				},
				zIndex: null,
			},
			{
				// classes: ['a5e-sheet'],
				width: options.width ?? 420,
				height: options.height ?? 'auto',
				resizable: options.resizable ?? false,
			},
		);

		this.data.content.props.dialog = this;

		this.promise = new Promise((resolve) => {
			this.resolve = resolve;
		});
	}

	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ['a5e-sheet', 'a5e-sheet--action'],
			minimizable: true,
			svelte: {
				target: document.body,
			},
		});
	}

	/** @inheritdoc */
	close(options) {
		this.#resolvePromise(null);
		this.document?.destroy();

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
		this.document?.destroy();

		return super.close();
	}

	#resolvePromise(data) {
		if (this.resolve) {
			this.resolve(data);
		}
	}
}
