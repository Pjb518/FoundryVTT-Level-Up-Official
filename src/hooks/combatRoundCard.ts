function postCard(titleKey: string | null, round: number) {
	if (!game.settings.get('a5e', 'showCombatRoundCards')) return;
	if (!game.users.activeGM?.isSelf) return;

	const toPlayers = game.settings.get('a5e', 'showCombatRoundCardsToPlayers');
	const roundLabel = game.i18n.format('A5E.combat.chatCard.round', { round });
	const title = titleKey ? game.i18n.localize(titleKey) : roundLabel;
	const roundHtml = titleKey
		? `<span class="a5e-combat-card__round">${roundLabel}</span>`
		: '';

	ChatMessage.create({
		content: `<div class="a5e-combat-card"><h3 class="a5e-combat-card__title">${title}</h3>${roundHtml}</div>`,
		whisper: toPlayers
			? []
			: game.users.filter((u) => u.isGM).map((u) => u.id),
	});
}

// Foundry fires these hooks before the update is applied, so `combat.round`
// still holds the previous value; the new round is in the update data.
export function combatStart(_combat: Combat, updateData: { round: number }) {
	postCard('A5E.combat.chatCard.started', updateData.round || 1);
}

export function combatRound(_combat: Combat, updateData: { round: number }) {
	// Round 1 is already covered by the combat started card.
	if (updateData.round <= 1) return;
	postCard(null, updateData.round);
}

export function deleteCombat(combat: Combat) {
	if (!combat.round) return;
	postCard('A5E.combat.chatCard.ended', combat.round);
}
