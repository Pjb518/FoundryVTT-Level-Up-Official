import { RestManager } from '#managers/RestManager.ts';

class EncounterA5e extends Combat {
	// -------------------------------------------
	// Event Handlers
	// -------------------------------------------

	protected override async _onEndTurn(combatant, context) {
		if (!this.started || !context.skipped) return;
		const roundOfLastTurnEnd = combatant.flags.a5e.roundOfLastTurnEnd;
		const alreadyWent = typeof context.round === 'number' && roundOfLastTurnEnd === context.round;
		if (!alreadyWent) return combatant.onEndTurn({ round: context.round });
	}

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
