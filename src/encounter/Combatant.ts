import { RestManager } from '#managers/RestManager.ts';

class CombatantA5e extends Combatant {
	get encounter() {
		return this.parent;
	}

	/** The round this combatant last had a turn */
	get roundOfLastTurn(): number | null {
		return this.flags?.a5e?.roundOfLastTurn;
	}

	async onStartTurn(): Promise<void> {
		const { actor, encounter } = this;
		if (!actor || !encounter) return;

		this.update({ 'flags.a5e.roundOfLastTurn': encounter.round }, { render: false });

		const eventType = 'turn-start';
		await this.#performActorUpdates(eventType);
	}

	async onEndTurn(options: { round: number }): Promise<void> {
		const { round } = options;
		const { actor, encounter } = this;
		if (!actor || !encounter) return;

		const eventType = 'turn-end';
		await this.#performActorUpdates(eventType);

		await this.update({ 'flags.a5e.roundOfLastTurn': round });
	}

	async #performActorUpdates(event: 'turn-start' | 'turn-end'): Promise<void> {
		const { actor } = this;
		if (!actor) return;

		// Recharge turn and round based durations
		if (event === 'turn-start') await RestManager.recharge(actor, { duration: 'round' });
	}
}

export { CombatantA5e };
