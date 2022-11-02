<script>
	import { getContext } from 'svelte';

	import updateDocumentDataFromField from '../../utils/updateDocumentDataFromField';

	export let resource;
	export let source;

	const actor = getContext('actor');
</script>

<div class="resource resource-{source}">
	<header class="resource-header">
		<input
			type="text"
			name="system.resources.{source}.label"
			value={resource.label}
			class="a5e-input a5e-input--slim resource-label"
			placeholder={source.capitalize()}
			on:change={({ target }) =>
				updateDocumentDataFromField($actor, target.name, target.value)}
		/>
	</header>

	<div class="resource-value-container">
		<input
			type="number"
			name="system.resources.{source}.value"
			value={resource.value}
			class="a5e-input a5e-input--inline-item a5e-input--small resource-number-input"
			placeholder="0"
			on:change={({ target }) =>
				updateDocumentDataFromField($actor, target.name, target.value)}
		/>

		<span class="resource-seperator"> / </span>

		<input
			type="number"
			name="system.resources.{source}.max"
			value={resource.max}
			class="a5e-input a5e-input--inline-item a5e-input--small resource-number-input"
			placeholder="0"
			on:change={({ target }) =>
				updateDocumentDataFromField($actor, target.name, target.value)}
		/>
	</div>

	<div class="resource-setting">
		<i class="fas fa-gear" />
	</div>
</div>

<style lang="scss">
	.resource {
		position: relative;
		padding: 0.125rem;
		border: 1px solid #ccc;
		border-radius: 2px;
		height: 4.5rem;
	}

	.resource-label {
		padding: 0;
		border: 0;
		background: transparent;
		color: inherit;
		text-align: center;
		text-overflow: ellipsis;
	}

	.resource-value-container {
		display: flex;
		align-items: center;
		justify-content: center;
		padding-bottom: 0.275rem;
	}

	.resource-number-input {
		width: calc(3ch + 1rem);
	}

	.resource-setting {
		position: absolute;
		bottom: 0.125rem;
		right: 0.125rem;
		cursor: pointer;
	}
</style>
