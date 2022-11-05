<script>
	import { getContext } from 'svelte';

	import updateDocumentDataFromField from '../../utils/updateDocumentDataFromField';

	const actor = getContext('actor');
</script>

<!-- <div
        v-if="sheetIsLocked"
        class="a5e-ability-score__value a5e-ability-score__value--ac"
    >
        {$actor.system.attributes.ac}
    </div> -->

<li>
	<h4 class="ac-label">AC</h4>
	<input
		class="ac-value"
		name="system.attributes.ac"
		type="number"
		value={$actor.system.attributes.ac}
		placeholder="10"
		on:change={({ target }) =>
			updateDocumentDataFromField($actor, target.name, Number(target.value))}
	/>
</li>

<style lang="scss">
	.ac-value,
	.ac-value[type='number'] {
		display: flex;
		align-items: center;
		height: 26px;
		border: 0;
		background: none;
		font-weight: inherit;
		text-align: center;
		font-size: 1.44rem;
		width: 2.5rem;

		background-color: rgb(0 0 0/ 0.15);
		border-radius: 50% 50% 50% 50% / 12% 12% 88% 88%;
		height: 2.5rem;
		margin: auto;
	}

	.ac-label {
		font-size: 0.694rem;
		text-align: center;
		padding-bottom: 0.125rem;
	}
</style>
