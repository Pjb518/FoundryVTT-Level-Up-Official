import { RestManager } from '#managers/RestManager.ts';

class EncounterA5e extends Combat {
	// -------------------------------------------
	// Event Handlers
	// -------------------------------------------

	/** @inheritdoc */
	override async startCombat() {
		const encounter = await super.startCombat();

		// Reset tokens to trigger default movement recalculation
		const { combatants } = encounter;
		for (const c of combatants) {
			c.token?.reset();
		}

		return encounter;
	}

	/** @inheritdoc */
	override async endCombat() {
		const encounter = await super.endCombat();

		// Reset tokens to trigger default movement recalculation
		const { combatants } = encounter;
		for (const c of combatants) {
			c.token?.reset();
		}

		return encounter;
	}

	/** @inheritdoc */
	protected override async _onEndTurn(combatant, context) {
		if (!this.started || !context.skipped) return;
		const roundOfLastTurnEnd = combatant.flags.a5e.roundOfLastTurnEnd;
		const alreadyWent = typeof context.round === 'number' && roundOfLastTurnEnd === context.round;
		if (!alreadyWent) return combatant.onEndTurn({ round: context.round });
	}

	/** @inheritdoc */
	protected override async _onStartTurn(combatant, context) {
		const alreadyWent =
			typeof context.round === 'number' && combatant.roundOfLastTurnEnd === context.round;
		if (!alreadyWent) await combatant.onStartTurn();

		for (const other of this.combatants) {
			if (combatant !== other && other.actor) {
				RestManager.recharge(other.actor, { duration: 'turn' });
			}
		}
	}
}

export { EncounterA5e };
