<svelte:options accessors={true} />

<script lang="ts">
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";
    import { setContext } from "svelte";

    import calculateHeaderTextColor from "../../utils/calculateHeaderTextColor";
    import prepareRolls from "../dataPreparationHelpers/cardRolls/prepareRolls";

    import CardHeader from "./CardHeader.svelte";
    import RollSummary from "./body/RollSummary.svelte";

    export let messageDocument;

    const message = new TJSDocument(messageDocument);
    const { system } = $message;

    const headerBackgroundColor = $message.author.color;
    const headerTextColor = calculateHeaderTextColor(headerBackgroundColor);

    const { actorName, img } = system;
    const rolls = prepareRolls($message);

    setContext("message", message);
</script>

<CardHeader {actorName} {img} messageDocument={$message} />

<article
    class="a5e-chat-card__body"
    style="--a5e-user-background-color: {headerBackgroundColor}; --a5e-user-text-color: {headerTextColor};"
>
    <section class="rolls">
        {#each rolls ?? [] as [roll, rollData], i}
            <RollSummary {roll} {rollData} />
        {/each}
    </section>
</article>
