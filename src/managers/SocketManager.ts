class SocketManager {
	#identifier = 'system.a5e';

	constructor() {
		this.#activateSocketListeners();
	}

	/** Get identifier for sockets */
	get identifier() {
		return this.#identifier;
	}

	/** Handle listening of sockets */
	#activateSocketListeners() {
		game.socket.on(this.identifier, async (...[message, userId]: SocketManager.EventParams) => {
			const sender = game.users.get(userId, { strict: true });

			switch (message.request) {
				case 'placeBehaviorRegion':
					return this.#placeBehaviorRegion(message);
				default:
					throw Error(`Received unsupported socket emission: ${message.request}`);
			}
		});
	}

	/** Run something as a GM */
	async #placeBehaviorRegion(message: SocketManager.PlaceBehaviorRegion) {
		if (!game.user.isActiveGM) return null;

		const doc = message.data.document;
		const sceneId = message.data.sceneId ?? canvas.scene?.id;
		if (!sceneId || !doc) return;

		const scene = game.scenes.get(sceneId);
		if (!scene) return;

		// @ts-expect-error
		return scene.createEmbeddedDocuments('Region', [doc], { controlObject: true, parent: scene });
	}
}

declare namespace SocketManager {
	type PlaceBehaviorRegion = {
		request: 'placeBehaviorRegion';
		data: {
			document: RegionDocument;
			sceneId?: string;
		};
	};

	type SocketMessage = PlaceBehaviorRegion | { request?: never };

	type EventParams = [message: SocketMessage, userId: string];
}

export { SocketManager };
