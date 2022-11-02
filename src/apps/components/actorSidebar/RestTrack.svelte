<script>
	import { getContext } from 'svelte';

	const actor = getContext('actor');
</script>

<div class="rest" data-tooltip="A5E.Rest" data-tooltip-direction="DOWN">
	<i class="rest-icon fas fa-campfire" />
</div>

<style lang="scss">
	.rest {
		position: absolute;
		align-items: center;
		overflow: hidden;
		bottom: 2.25rem;
		right: -0.25rem;
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		z-index: 5;

		&-icon {
			display: flex;
			width: 2rem;
			height: 2rem;
			align-items: center;
			justify-content: center;
			background-color: #f6f2eb;
			border: 1px solid #ccc;
			box-shadow: 0 0 10px #ccc inset;
			color: rgba(0 0 0 / 0.2);
			font-size: 1.2rem;
			cursor: pointer;
		}
	}
</style>
