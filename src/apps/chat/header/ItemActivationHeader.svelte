<script>
    import { createEventDispatcher } from "svelte";

    import BaseHeader from "./BaseHeader.svelte";

    export let message;

    const dispatch = createEventDispatcher();
    const { img, name } = $message.flags?.a5e;
</script>

<BaseHeader
    {img}
    altText={name}
    title={name}
    on:repeatCard={() => dispatch("repeatCard")}
/>
