class CombatantA5e extends Combatant {
	get encounter() {
		return this.parent;
	}

	async onStartTurn(): Promise<void> {
		const { actor, encounter } = this;
		if (!actor || !encounter) return;

		const eventType = 'turn-start';
		await this.#performActorUpdates(eventType);
	}

	async onEndTurn(): Promise<void> {
		const { actor, encounter } = this;
		if (!actor || !encounter) return;

		const eventType = 'turn-end';
		await this.#performActorUpdates(eventType);
	}

	async #performActorUpdates(event: 'turn-start' | 'turn-end'): Promise<void> {
		const { actor } = this;
		if (!actor) return;

		// Recharge turn and round based durations
	}
}

export { CombatantA5e };
