<script>
	import { getContext } from 'svelte';

	export let passiveFields;

	const actor = getContext('actor');

	$: passiveFields = [
		{
			label: 'Maneuver DC',
			value: $actor.system.maneuverDC,
		},
		{
			label: 'Spell DC',
			value: $actor.system.spellDC,
		},
		{
			label: 'Passive Percep.',
			value: $actor.system.skills.prc.passive,
		},
	];
</script>

<div class="passives-container">
	{#each passiveFields as { label, value }}
		<div class="passive-box">
			<h4 class="passive-label">{label}</h4>

			<div class="passive-value">
				{value}
			</div>
		</div>
	{/each}
</div>

<style lang="scss">
	.passives-container {
		display: flex;
		gap: 0.25rem;
	}

	.passive-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 3.5rem;
		padding: 0.125rem 0;
		font-family: 'Modesto Condensed', serif;
		color: #7e7960;
		border: 1px solid #ccc;
		border-radius: 4px;
		background-color: #f6f2eb;
		box-shadow: 0 0 5px #ccc inset;
		z-index: 4;
	}

	.passive-label {
		font-size: 0.694rem;
	}

	.passive-value {
		color: black;
		text-align: center;
		padding-inline: 0.25rem;
		font-size: 1rem;
	}
</style>
