<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import BaseHeader from "./BaseHeader.svelte";

    export let message;

    const { abilityKey, img, name, skillKey } = $message.flags?.a5e;
    const { abilities, skills } = CONFIG.A5E;
</script>

<BaseHeader
    {img}
    altText={name}
    title={`${localize(skills[skillKey])} Check`}
    subtitle={localize(abilities[abilityKey] ?? "No Ability Selected")}
/>
