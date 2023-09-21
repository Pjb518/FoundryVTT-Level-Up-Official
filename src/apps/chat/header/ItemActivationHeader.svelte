<script>
    import BaseHeader from "./BaseHeader.svelte";

    export let message;

    const { actionName, img, name } = $message.flags?.a5e;
</script>

<BaseHeader
    {img}
    altText={name}
    clickableHeader={true}
    subtitle={actionName}
    title={name}
    on:toggleCriticalDamage
    on:toggleDescription
/>
