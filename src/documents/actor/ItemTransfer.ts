export interface ItemTransferData {
	source: {
		tokenId?: string;
		actorId: string;
		itemId: string;
	};
	target: {
		tokenId?: string;
		actorId: string;
	};
	quantity: number;
	containerId?: string;

	/** Whether this is a merchant transaction. */
	mode?: 'move' | 'purchase';
}

class ItemTransfer implements ItemTransferData {
	source: ItemTransferData['source'];
	target: ItemTransferData['target'];
	quantity: number;
	containerId?: string;
	mode: 'move' | 'purchase';

	constructor(data: ItemTransferData) {
		this.source = data.source;
		this.target = data.target;
		this.quantity = data.quantity;
		this.containerId = data.containerId;
		this.mode = data.mode ?? 'move';
	}

	async request(): Promise<void> {
		const gm = game.users.activeGM;
		if (!gm) {
			const source = this.#getSource();
			const target = this.#getTarget();

			// TODO:
		}
	}

	/** Transfer an item from one actor to another. Only a GM can call this method */
	async enact(requester: User) {
		if (!game.user.isGM) {
			ui.notifications.error('Unauthorized Item Transfer');
			return;
		}

		console.log('A5E | Enacting item transfer');
		const sourceActor = this.#getSource();
		const sourceItem = sourceActor?.itemTypes.object.find((i) => i.id === this.source.itemId);
		const targetActor = this.#getTarget();

		if (!sourceActor || !sourceItem || !targetActor) {
			ui.notifications.error('Unable to find actor or item to transfer.');
			return;
		}

		const targetItem = await sourceActor.transferItemToActor(
			targetActor,
			sourceItem,
			this.quantity,
			this.containerId,
			false,
			this.mode === 'purchase',
		);

		// this.#sendMessage(requester, sourceActor, targetActor, targetItem);
	}

	#getActor(tokenId: string | undefined, actorId: string): Actor.Implementation | null {
		if (typeof tokenId === 'string') {
			const token = canvas?.tokens.placeables.find((t) => t.id === tokenId);
			return token?.actor ?? null;
		}

		return game.actors.get(actorId) ?? null;
	}

	/** Get source actor */
	#getSource(): Actor.Implementation | null {
		return this.#getActor(this.source.tokenId, this.source.actorId);
	}

	/** Get target actor */
	#getTarget(): Actor.Implementation | null {
		return this.#getActor(this.target.tokenId, this.target.actorId);
	}
}

export { ItemTransfer };
