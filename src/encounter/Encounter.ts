import { RestManager } from '#managers/RestManager.ts';

class EncounterA5e extends Combat {
	// -------------------------------------------
	// Chat Cards
	// -------------------------------------------

	#postChatCard(titleKey: string | null, round: number) {
		if (!game.settings.get('a5e', 'showCombatRoundCards')) return;
		if (!game.users.activeGM?.isSelf) return;

		const toPlayers = game.settings.get('a5e', 'showCombatRoundCardsToPlayers');
		const roundLabel = game.i18n.format('A5E.combat.chatCard.round', { round });
		const title = titleKey ? game.i18n.localize(titleKey) : roundLabel;
		const roundHtml = titleKey ? `<span class="a5e-combat-card__round">${roundLabel}</span>` : '';

		ChatMessage.create({
			content: `<div class="a5e-combat-card"><h3 class="a5e-combat-card__title">${title}</h3>${roundHtml}</div>`,
			whisper: toPlayers ? [] : game.users.filter((u) => u.isGM).map((u) => u.id),
		});
	}

	/** @inheritdoc */
	protected override async _preUpdate(changed, options, user) {
		if (typeof changed.round === 'number' && changed.round !== this.round) {
			if (this.round === 0 && changed.round >= 1) options.a5eRoundCard = 'started';
			else if (changed.round > 1) options.a5eRoundCard = 'round';
		}
		return super._preUpdate(changed, options, user);
	}

	/** @inheritdoc */
	protected override _onUpdate(changed, options, userId) {
		super._onUpdate(changed, options, userId);
		if (options.a5eRoundCard === 'started') {
			this.#postChatCard('A5E.combat.chatCard.started', this.round || 1);
		} else if (options.a5eRoundCard === 'round') {
			this.#postChatCard(null, this.round);
		}
	}

	/** @inheritdoc */
	protected override _onDelete(options, userId) {
		super._onDelete(options, userId);
		if (this.round) this.#postChatCard('A5E.combat.chatCard.ended', this.round);
	}

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
