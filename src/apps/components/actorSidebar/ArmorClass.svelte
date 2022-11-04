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

<input
	class="ac-value"
	name="system.attributes.ac"
	type="number"
	value={$actor.system.attributes.ac}
	placeholder="10"
	on:change={({ target }) =>
		updateDocumentDataFromField($actor, target.name, Number(target.value))}
/>

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
		font-size: 1.728rem;
		width: 3rem;
	}
</style>
