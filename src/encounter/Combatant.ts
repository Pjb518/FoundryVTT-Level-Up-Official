import { RestManager } from '#managers/RestManager.ts';

import BaseCombatant = foundry.documents.BaseCombatant;

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

	/** ================================================================= */
	// Static Methods
	/** ================================================================= */
	static override createDocuments(
		data: BaseCombatant.CreateInput[],
		operation?: BaseCombatant.Database.CreateDocumentsOperation,
	) {
		this.#swapPartyMembers(data, operation);
		return super.createDocuments(data, operation);
	}

	/** Change party combatant for its members */
	static #swapPartyMembers(
		data: BaseCombatant.CreateInput[],
		operation?: BaseCombatant.Database.CreateDocumentsOperation,
	) {
		[...data].forEach((d) => {
			const actor = game.actors.get((d.actorId as string) ?? '');
			const scene = game.scenes.get((d.sceneId as string) ?? '');
			if (!scene || !actor?.isParty()) return;

			data.findSplice((_d) => _d.actorId === actor.id);

			actor.members.forEach((m) => {
				const token = m.getDependentTokens({ scenes: [scene], linked: true }).at(0);
				const alreadyAdded = operation?.parent?.combatants?.some?.((c) => c.actor === m);
				const alreadyBeingAdded = data.some((_d) => _d.actorId === m.id!);
				if (token && !alreadyAdded && !alreadyBeingAdded) {
					data.push({
						actorId: m.id,
						sceneId: scene.id,
						tokenId: token.id,
						hidden: !!d.hidden,
					});
				}
			});
		});
	}
}

export { CombatantA5e };
