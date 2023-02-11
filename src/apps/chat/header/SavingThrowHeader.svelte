<script>
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import BaseHeader from "./BaseHeader.svelte";

    export let message;

    const actor = new TJSDocument(fromUuidSync($message.flags?.a5e?.actorId));
    const { abilityKey } = $message.flags?.a5e;
    const { abilities } = CONFIG.A5E;
</script>

<BaseHeader
    img={$actor.img ?? $actor.actor.img}
    alt={$actor.name}
    title={`${localize(abilities[abilityKey])} Save`}
/>
