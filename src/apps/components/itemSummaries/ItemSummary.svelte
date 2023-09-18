<script>
    import { localize } from "#runtime/svelte/helper";

    const fields = [
        {
            field: "activationCost",
            label: "A5E.ActionActivationCost",
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
            label: "A5E.ItemDuration",
        },
        {
            field: "craftingComponents",
            label: "A5E.CraftingComponents",
        },
    ];

    export let summaryData = {};
    let listHeight;
</script>

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

<style lang="scss">
    .field-header {
        font-weight: bold;
    }

    .item-properties {
        font-style: italic;
        margin-bottom: 0.5rem;
    }

    .summary-list {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        list-style: none;
        margin: 0;
        margin-bottom: var(--margin-bottom, 0);
        padding: 0;
    }
</style>
