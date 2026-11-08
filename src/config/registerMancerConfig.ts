export function registerMancerConfig() {
	const abilityScoresGenerationVaraints = {
		standardArray: 'Standard Array',
		standardRoll: 'Standard Roll',
		rerollOne: 'Standard Roll Rerolling 1s',
		pointBuy: 'Point Buy',
		custom: ' Custom',
	} as const;

	const abilityScoresStandardArray = [15, 14, 13, 12, 10, 8] as const;

	const abilityScoresPointBuyBudget = 27;
	const abilityScoresPointBuyCost = {
		8: 0,
		9: 1,
		10: 2,
		11: 3,
		12: 4,
		13: 5,
		14: 7,
		15: 9,
	} as const;

	const abilityScoresRollFormulas = {
		standard: '4d6kh3' as const,
		rerollOne: '4d6kh3rr1' as const,
	} as const;

	return {
		abilityScoresGenerationVaraints,
		abilityScoresStandardArray,
		abilityScoresPointBuyBudget,
		abilityScoresPointBuyCost,
		abilityScoresRollFormulas,
	};
}
