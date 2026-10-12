declare module 'fvtt-types/configuration' {
	interface DocumentClassConfig {
		Scene: typeof SceneA5E;
	}
}

class SceneA5E extends Scene {
	#sizeSyncBatch = new Map<string, { width: number; height: number }>();

	/** ================================================================= */
	// Getters
	/** ================================================================= */

	/** Check if the scene is curently in focus */
	get isInFocus(): boolean {
		const onlyGM = game.user.isGM && game.users.filter((u) => u.active).length === 1;
		return (this.active && !onlyGM) || (this.isView && onlyGM);
	}

	/** ================================================================= */
	// Data Preperation Methods
	/** ================================================================= */

	/** ================================================================= */
	// Methods
	/** ================================================================= */

	/** Synchronize a token's dimensions with its actor's size category. */
	syncTokenDimensions(doc: TokenDocument, dims: { width: number; height: number }) {
		if (!doc.parent?.tokens.has(doc.id!)) return;
		this.#sizeSyncBatch.set(doc.id!, dims);
		this.#processSyncBatch();
	}

	/** Retrieve size and clear size-sync batch, make updates. */
	#processSyncBatch = foundry.utils.debounce((): void => {
		const entries = this.#sizeSyncBatch
			.entries()
			.toArray()
			.map(([_id, { width, height }]) => ({ _id, width, height }));
		this.#sizeSyncBatch.clear();
		this.updateEmbeddedDocuments('Token', entries, { animation: { movementSpeed: 1.5 } });
	}, 0);
}

export { SceneA5E };
