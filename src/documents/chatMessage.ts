class ChatMessageA5e extends ChatMessage {
	/** ------------------------------------------------------ */
	/**                       Getters                          */
	/** ------------------------------------------------------ */
	get actor(): any {
		const uuid = this.system.actorId;
		if (!uuid) return undefined;

		return fromUuidSync(uuid) ?? undefined;
	}

	get item(): any {
		const uuid = this.system.itemId;
		if (!uuid) return undefined;

		return fromUuidSync(uuid) ?? undefined;
	}

	get token(): any {
		const { actor } = this;
		if (!actor) return undefined;

		return actor.token ?? actor.getActiveTokens()?.[0]?.document ?? undefined;
	}

	/** ------------------------------------------------------ */
	/**                     Data Prep                          */
	/** ------------------------------------------------------ */
}

export { ChatMessageA5e };
