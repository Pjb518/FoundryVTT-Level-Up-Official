export type SystemChatMessageTypes = Exclude<foundry.documents.BaseChatMessage.TypeNames, 'base'>;

interface ChatMessageA5e<ChatMessageType extends SystemChatMessageTypes = SystemChatMessageTypes> {
	type: ChatMessageType;
	system: DataModelConfig['ChatMessage'][ChatMessageType];
}

class ChatMessageA5e extends ChatMessage {
	/** ------------------------------------------------------ */
	/**                    Type Helpers                        */
	/** ------------------------------------------------------ */
	isType<TypeName extends SystemChatMessageTypes>(
		type: TypeName,
	): this is ChatMessageA5e<TypeName> {
		return type === (this.type as SystemChatMessageTypes);
	}

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

		return actor.token ?? undefined;
	}

	/** ------------------------------------------------------ */
	/**                     Data Prep                          */
	/** ------------------------------------------------------ */
}

export { ChatMessageA5e };
