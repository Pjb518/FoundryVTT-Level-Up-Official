<script>
	import { getContext } from 'svelte';

	import computeTotalAvailableHitDice from '../../utils/computeTotalAvailableHitDice';

	const actor = getContext('actor');
	$: availableHitDice = computeTotalAvailableHitDice($actor);
</script>

<li>
	<h4 class="hit-die-label">Hit Dice</h4>
	<div
		class="hit-dice"
		data-tooltip="A5E.HitDiceRemaining"
		data-tooltip-direction="DOWN"
	>
		{availableHitDice}
	</div>
</li>

<style lang="scss">
	.hit-dice {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		width: 2.5rem;
		height: 2.5rem;
		font-size: 1.44rem;
		font-family: 'Modesto Condensed', serif;
		color: #7e7960;
		border: 1px solid #ccc;
		border-radius: 50%;
		background: #f6f2eb;
		box-shadow: 0 0 10px #ccc inset;
		margin: auto;
	}

	.hit-die-label {
		font-size: 1rem;
		text-align: center;
		padding-bottom: 0.125rem;
	}
</style>
