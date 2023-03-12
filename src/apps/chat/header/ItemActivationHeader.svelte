<script>
    import { createEventDispatcher } from "svelte";

    import BaseHeader from "./BaseHeader.svelte";

    export let message;

    const dispatch = createEventDispatcher();
    const { actionName, img, name } = $message.flags?.a5e;
</script>

<BaseHeader
    {img}
    altText={name}
    title={name}
    subtitle={actionName}
    on:repeatCard={() => dispatch("repeatCard")}
/>
