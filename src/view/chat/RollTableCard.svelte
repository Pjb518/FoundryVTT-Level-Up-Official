<script lang="ts">
    import { setContext } from "svelte";

    import { prepareRolls } from "#utils/view/cards/cardRolls/prepareRolls.ts";

    import RollTableCardHeader from "./RollTableCardHeader.svelte";
    import RollSummary from "./components/RollSummary.svelte";

    type Props = {
        messageDocument: any;
    };

    let { messageDocument }: Props = $props();

    const message = messageDocument;
    const { system } = message;

    const { tableName, tableId, resultTitle, img, description } = system;
    const rolls = prepareRolls(message);

    setContext("message", message);
</script>

<RollTableCardHeader {tableName} {img} messageDocument={message} />

<article class="a5e-chat-card__body">
    <h3 class="">{resultTitle}</h3>

    <hr class="a5e-rule a5e-rule--card" />

    <section class="description-block">
        {@html description}
    </section>

    <hr class="a5e-rule a5e-rule--card" />

    <section class="rolls">
        {#each rolls ?? [] as [roll, rollData], i}
            <RollSummary {roll} {rollData} />
        {/each}
    </section>
</article>

<style lang="scss">
    h3 {
        font-weight: bold;
        font-size: var(--a5e-sm-text);
        border-bottom: 0;
        margin-bottom: 0;
    }

    .description-block {
        display: flex;
        padding-inline: 0.125rem;
        flex-direction: column;
        gap: 0.25rem;
        margin-block: 0.5rem;
    }

    .rolls {
        margin-top: 0.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
</style>
