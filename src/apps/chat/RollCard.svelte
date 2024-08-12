<svelte:options accessors={true} />

<script lang="ts">
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";
    import { setContext } from "svelte";

    import prepareRolls from "../dataPreparationHelpers/cardRolls/prepareRolls";

    import RollCardHeader from "./RollCardHeader.svelte";
    import RollSummary from "./body/RollSummary.svelte";

    export let messageDocument;

    const message = new TJSDocument(messageDocument);
    const { system } = $message;

    const { actorName, img } = system;
    const rolls = prepareRolls($message);

    setContext("message", message);
</script>

<RollCardHeader {actorName} {img} messageDocument={$message} />

<article class="a5e-chat-card__body">
    <section class="rolls">
        {#each rolls ?? [] as [roll, rollData], i}
            <RollSummary {roll} {rollData} />
        {/each}
    </section>
</article>
