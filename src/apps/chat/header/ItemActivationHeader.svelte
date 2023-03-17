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
    clickableHeader={true}
    subtitle={actionName}
    title={name}
    on:repeatCard={() => dispatch("repeatCard")}
    on:toggleDescription
/>
