<script lang="ts">
    import { localize } from "#utils/localization/localize.ts";

    type Props = {
        summaryData: Record<string, any>;
    };

    let { summaryData = {} } = $props();

    const fields = [
        {
            field: "craftingComponents",
            label: "A5E.CraftingComponents",
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

    let listHeight = $state(0);
</script>

<div class="a5e-summary-wrapper">
    {#if summaryData.objectMechanics}
        <p class="a5e-summary__item-properties">
            {summaryData.objectMechanics}
        </p>
    {/if}

    {#if summaryData.objectProperties}
        <p class="a5e-summary__item-properties">
            {summaryData.objectProperties}
        </p>
    {/if}

    {#if summaryData.maneuverProperties}
        <p class="a5e-summary__item-properties">
            {summaryData.maneuverProperties}
        </p>
    {/if}

    {#if summaryData.spellProperties}
        <p class="a5e-summary__item-properties">
            {summaryData.spellProperties}
        </p>
    {/if}

    {#if fields.some(({ field }) => summaryData[field])}
        <ul
            bind:clientHeight={listHeight}
            class="a5e-summary__list"
            class:hide={listHeight === 0}
        >
            {#each fields as { field, label }}
                {#if summaryData[field]}
                    <li>
                        <span class="a5e-summary__field-header">
                            {localize(label)}:
                        </span>
                        {summaryData[field]}
                    </li>
                {/if}
            {/each}
        </ul>
    {/if}
</div>

<style lang="scss">
    .a5e-summary {
        &-wrapper {
            display: flex;
            flex-direction: column;
            padding-block: 0.5rem;
            gap: 0.25rem;
            font-size: var(--a5e-sm-text);
        }

        &__item-properties {
            display: block;
            margin-bottom: 0;
            padding-inline: var(--inline-padding, 0);
            font-style: italic;
        }

        &__list {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            list-style: none;
            margin: 0 0 0 0;
            padding: 0 var(--inline-padding, 0);
        }

        &__field-header {
            font-weight: bold;
        }
    }
</style>
