<script>
    import { createEventDispatcher } from "svelte";

    import BaseHeader from "./BaseHeader.svelte";

    export let message;

    const dispatch = createEventDispatcher();
    const { img, name } = $message?.flags?.a5e;
</script>

{#if }
<BaseHeader
    {img}
    altText={name}
    clickableHeader={false}
    title={name}
    on:repeatCard={() => dispatch("repeatCard")}
/>
{/if}
