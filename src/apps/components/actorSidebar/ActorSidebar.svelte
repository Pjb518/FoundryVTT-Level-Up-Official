<script>
	import { getContext } from 'svelte';

	import ArmorClass from './ArmorClass.svelte';
	import HitDice from './HitDice.svelte';
	import HitPointBar from './HitPointBar.svelte';
	import HitPointValues from './HitPointValues.svelte';
	import Initiative from './Initiative.svelte';
	import Passives from './Passives.svelte';
	import RestTrack from './RestTrack.svelte';
	import StatusTrack from './StatusTrack.svelte';
	import Details from './Details.svelte';

	export let hp;

	const actor = getContext('actor');

	$: hp = $actor.system.attributes.hp;
</script>

<div class="actor-sidebar">
	<section class="actor-portrait-wrapper">
		<HitPointBar {hp}>
			<img
				class="actor-image"
				src={$actor.img}
				alt={$actor.name}
				title={$actor.name}
			/>
		</HitPointBar>

		<StatusTrack
			icon="fa-running"
			tooltipText="A5E.Fatigue"
			trackProperty="fatigue"
			value={$actor.system.attributes.fatigue}
		/>

		<StatusTrack
			icon="fa-brain"
			tooltipText="A5E.Strife"
			trackProperty="strife"
			value={$actor.system.attributes.strife}
		/>

		<RestTrack />
	</section>

	<!--  -->
	<HitPointValues {hp} />

	<!--  -->
	<ul class="actor-glance-trackers">
		<ArmorClass />
		<HitDice />
		<Initiative />
	</ul>

	<!--  -->
	<div class="actor-details">
		<Details />
	</div>

	<footer class="actor-sidebar-footer">
		<Passives />
	</footer>
</div>

<style lang="scss">
	.actor-sidebar {
		display: flex;
		flex-direction: column;
		flex-grow: 0;
		flex-shrink: 0;
		height: 100%;
		width: 200px;
		padding: 0.75rem;
		border-right: 1px solid #ccc;
	}

	.actor-portrait-wrapper {
		position: relative;
		padding: 0 0.5rem 0.125rem 0rem;
		margin-block-end: 0.5em;
	}

	.actor-image {
		border-radius: 50%;
		cursor: pointer;
		width: 8rem;
		height: 8rem;
		z-index: 1;
	}

	.actor-glance-trackers {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
		margin-block: 1rem;
		padding: 0;
		list-style: none;
	}

	.actor-details {
		border: 1px solid #ccc;
		box-shadow: 0 0 5px #ccc inset;
		overflow-y: auto;
	}

	.actor-sidebar-footer {
		margin-top: auto;
		padding-bottom: 00.125rem;
	}
</style>
