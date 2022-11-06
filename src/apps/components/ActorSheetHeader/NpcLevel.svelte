<script>
	import { getContext } from 'svelte';

	import updateDocumentDataFromField from '../../utils/updateDocumentDataFromField';

	const actor = getContext('actor');
</script>

<div class="level-container">
	<div class="level-box">
		<label class="xp-label" for="{$actor.id}-cr">CR</label>

		<input
			id="{$actor.id}-cr"
			class="xp-input"
			type="number"
			name="system.details.cr"
			value={$actor.system.details.cr}
			placeholder="0"
			min="0"
			on:change={({ target }) =>
				updateDocumentDataFromField($actor, target.name, target.value)}
			on:click={({ target }) => target.select()}
		/>
	</div>

	<div class="level-box">
		<label class="xp-label" for="{$actor.id}-prof"> Prof. </label>

		<input
			id="{$actor.id}-prof"
			class="xp-input"
			type="number"
			value={$actor.system.prof}
			placeholder="0"
			min="0"
			disabled
		/>
	</div>
</div>

<style lang="scss">
	.level-container {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		border-radius: 4px;
		height: 100%;
		font-family: 'Modesto Condensed', serif;
	}

	.level-box,
	.xp-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 4rem;
		padding: 0.125rem 0;
		color: #7e7960;
		border: 1px solid #ccc;
		border-radius: 4px;
		background: #f6f2eb;
		box-shadow: 0 0 5px #ccc inset;
		z-index: 4;
	}

	.level-box {
		width: 3rem;
	}

	.xp-input {
		height: unset;
		text-align: center;
		border: 0;
		background: transparent;
		padding-left: 0.125rem;
		padding-right: 0.125rem;
		font-size: 1rem;

		&:active,
		&:focus {
			outline: 0;
			box-shadow: none;
		}
	}

	.xp-label {
		font-size: 0.694rem;
	}
</style>
