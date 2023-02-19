<script>
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    import ItemActivationHeader from "./header/ItemActivationHeader.svelte";

    export let messageDocument;

    const message = new TJSDocument(messageDocument);
</script>

<ItemActivationHeader {message} />

{#if $message.flags?.a5e?.description}
    <hr class="a5e-rule a5e-rule--card" />

    <p>{@html $message.flags?.a5e?.description}</p>
{/if}
