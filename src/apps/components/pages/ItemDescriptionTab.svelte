<script>
    import { getContext } from "svelte";

    import Editor from "../Editor.svelte";
    import ItemSummary from "../itemSummaries/ItemSummary.svelte";

    export let summaryData = {};

    const item = getContext("item");

    $: content = $item.system.description;
</script>

{#if Object.values(summaryData ?? {}).some(Boolean)}
    <ItemSummary {summaryData} --inline-padding="0.25rem" />

    <hr class="a5e-rule a5e-rule--card" />
{/if}

<Editor document={item} {content} updatePath="system.description" />
