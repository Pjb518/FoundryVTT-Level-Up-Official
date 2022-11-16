<script>
	import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';
	import { getContext } from 'svelte';

	const actor = getContext('actor');

	$: attunement = $actor.system.attributes.attunement;
	$: sheetIsLocked = $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

{#if $actor.type === 'character'}
	<!--  -->
{/if}
