<script>
	import { getContext } from 'svelte';

	import rollInitiative from '../../handlers/rollInitiative';

	const actor = getContext('actor');
</script>

<i
	class="initiative-roll-button fas fa-dice-d20"
	on:click={() => rollInitiative($actor)}
/>

<!-- <div
        v-if="!sheetIsLocked"
        class="a5e-ability-score__buttons u-justify-center"
    >
        <i
            class="a5e-config-button fas fa-cog"
            title="Configure Initiative Bonuses"
            @click="onClickConfigButton"
        />
</div> -->
<style lang="scss">
	.initiative-roll-button {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-grow: 1;
		color: #7e7960;
		font-size: 1.44rem;
		cursor: pointer;

		transition: all 0.15s ease-in-out;

		&:hover {
			transform: scale(1.2);
			color: inherit;
		}
	}
</style>
