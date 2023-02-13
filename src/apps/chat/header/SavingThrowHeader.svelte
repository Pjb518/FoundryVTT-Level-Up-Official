<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import BaseHeader from "./BaseHeader.svelte";

    export let message;

    const { abilityKey, img, name } = $message.flags?.a5e;
    const { abilities } = CONFIG.A5E;
</script>

<BaseHeader
    {img}
    altText={name}
    title={`${localize(abilities[abilityKey])} Save`}
/>
