<script>
    import { localize } from "#runtime/svelte/helper";

    const generalFields = [
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
    ];

    const objectFields = [
        {
            field: "attunement",
            label: "A5E.Attunement",
        },
        {
            field: "rarity",
            label: "A5E.ItemRarity",
        },
        {
            field: "craftingComponents",
            label: "A5E.CraftingComponents",
        },
        {
            field: "price",
            label: "A5E.ItemPrice",
        },
    ];

    export let summaryData = {};
    let listHeight;
</script>

<div class="summary-wrapper">
    {#if summaryData.objectMechanics}
        <p class="item-properties">{summaryData.objectMechanics}</p>
    {/if}

    {#if summaryData.craftingComponents}
        <p class="crafting-components">{summaryData.craftingComponents}</p>
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

    {#each [objectFields, generalFields] as fieldGroup}
        {#if fieldGroup.some(({ field }) => summaryData[field])}
            <ul
                bind:clientHeight={listHeight}
                class="summary-list"
                class:hide={listHeight === 0}
            >
                {#each fieldGroup as { field, label }}
                    {#if summaryData[field]}
                        <li>
                            <span class="field-header">{localize(label)}:</span>
                            {summaryData[field]}
                        </li>
                    {/if}
                {/each}
            </ul>
        {/if}
    {/each}
</div>

<style lang="scss">
    .field-header {
        font-weight: bold;
    }

    .summary-wrapper .item-properties {
        display: block;
        font-style: italic;
        margin-bottom: 0;
        padding-inline: var(--inline-padding, 0);

        &:last-child {
            margin-bottom: 0;
        }
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
