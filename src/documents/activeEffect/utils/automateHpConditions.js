// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                     Conditions Object
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// eslint-disable-next-line no-unused-vars

/**
 * Apply the bloodied condition to token on half hp
 * @param {ActorA5e} actor
 * @param {Object} changes
 */
export default async function automateHpConditions(actor, changes, userId, conditionId) {
	// Guard for non-gm users
	if (game.user.id !== userId) return;

	// eslint-disable-next-line no-param-reassign
	conditionId = actor.type === 'npc' && conditionId === 'unconscious' ? 'dead' : conditionId;

	// Guard for non hp changes.
	if (!changes?.system?.attributes?.hp) return;

	const { value, max } = actor.system.attributes.hp;
	const condition = CONFIG.statusEffects.find((c) => c.id === conditionId);
	if (!condition) return;

	const isApplicable = conditionId === 'bloodied' ? value <= max / 2 && value > 0 : value <= 0;
	const overlay = ['unconscious', 'dead'].includes(conditionId);
	const hasCondition = actor.statuses.has(conditionId);

	// TODO: Call hook to recharge uses on bloodied

	if (isApplicable && !hasCondition) {
		actor.toggleStatusEffect(conditionId, { active: true, overlay });
		Hooks.callAll(`a5e.${conditionId}`, actor, true);

		if (conditionId === 'unconscious') actor.toggleStatusEffect('prone', { active: true });
	} else if (!isApplicable && hasCondition) {
		actor.toggleStatusEffect(conditionId, { active: false, overlay });
		Hooks.callAll(`a5e.${conditionId}`, actor, false);
	}
}
