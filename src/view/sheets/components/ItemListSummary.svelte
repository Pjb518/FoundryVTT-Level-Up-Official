<script lang="ts">
    import { localize } from "#utils/localization/localize.ts";

    const fields = [
        {
            field: "craftingComponents",
            label: "A5E.objects.craftingComponents",
        },
        {
            field: "spellClasses",
            label: "Classes",
        },
        {
            field: "activationCost",
            label: "A5E.actions.headings.activation.cost",
        },
        {
            field: "ranges",
            label: "A5E.ItemRange",
        },
        {
            field: "targets",
            label: "A5E.ItemTargetPlural",
        },
        {
            field: "area",
            label: "A5E.TargetArea",
        },
        {
            field: "spellComponents",
            label: "A5E.SpellComponents",
        },
        {
            field: "duration",
            label: "A5E.actions.headings.duration",
        },
        {
            field: "savingThrow",
            label: "A5E.ItemSavingThrow",
        },
    ];

    let { summaryData } = $props();
    let listHeight = $state(0);
</script>

<div class="summary-wrapper">
    {#if summaryData.objectMechanics}
        <p class="item-properties">{summaryData.objectMechanics}</p>
    {/if}

    {#if summaryData.objectProperties}
        <p class="item-properties">{summaryData.objectProperties}</p>
    {/if}

    {#if summaryData.maneuverProperties}
        <p class="item-properties">{summaryData.maneuverProperties}</p>
    {/if}

    {#if summaryData.spellProperties}
        <p class="item-properties">{summaryData.spellProperties}</p>
    {/if}

    {#if fields.some(({ field }) => summaryData[field])}
        <ul
            bind:clientHeight={listHeight}
            class="summary-list"
            class:hide={listHeight === 0}
        >
            {#each fields as { field, label }}
                {#if summaryData[field]}
                    <li>
                        <span class="field-header">{localize(label)}:</span>
                        {summaryData[field]}
                    </li>
                {/if}
            {/each}
        </ul>
    {/if}
</div>

<style lang="scss">
    .field-header {
        font-weight: bold;
    }

    .summary-wrapper .item-properties {
        display: block;
        margin-bottom: 0;
        padding-inline: var(--inline-padding, 0);
        font-style: italic;
    }

    .summary-list {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        list-style: none;
        margin: 0 0 0 0;
        padding: 0 var(--inline-padding, 0);
    }

    .summary-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
</style>
