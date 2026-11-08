import AbilityScores from '../components/AbilityScoresGeneration.svelte';

export function calculateNeededStep(actor: Character) {
	const mancerData = actor.system.mancer;
	const steps = mancerData.completedSteps;

	if (!steps.has('abilityScores')) return 0;
}

export function getSteps() {
	return [{ step: 0, label: 'Ability Scores', component: AbilityScores }];
}
