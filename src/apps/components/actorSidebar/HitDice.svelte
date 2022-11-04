<script>
	import { getContext } from 'svelte';

	import computeTotalAvailableHitDice from '../../utils/computeTotalAvailableHitDice';

	const actor = getContext('actor');
	$: availableHitDice = computeTotalAvailableHitDice($actor);
</script>

<div
	class="hit-dice"
	data-tooltip="A5E.HitDiceRemaining"
	data-tooltip-direction="DOWN"
>
	{availableHitDice}
</div>

<style lang="scss">
	.hit-dice {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		width: 2.125rem;
		height: 2.125rem;
		font-size: 1.2rem;
		font-family: 'Modesto Condensed', serif;
		color: #7e7960;
		border: 1px solid #ccc;
		border-radius: 50%;
		background: #f6f2eb;
		box-shadow: 0 0 10px #ccc inset;
		z-index: 4;
	}
</style>
