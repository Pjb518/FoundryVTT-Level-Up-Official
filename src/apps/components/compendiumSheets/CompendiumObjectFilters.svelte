<script>
    import { getContext } from "svelte";

    import CompendiumFilterCategory from "./CompendiumFilterCategory.svelte";

    export let compendiumType = "magicItem";

    const filterStore = getContext("filterStore");
    const { itemRarity, objectTypes } = CONFIG.A5E;

    function getFormSections() {
        const formSectionMap = [
            {
                filterKey: "objectType",
                heading: "Object Type",
                options: objectTypes,
            },
            {
                filterKey: "rarity",
                heading: "Item Rarity",
                options: itemRarity,
                display: compendiumType === "magicItem",
            },
            {
                filterKey: "miscellaneous",
                heading: "Miscellaneous",
                options: {
                    bulky: "Bulky",
                },
            },
        ];

        if (compendiumType === "magicItem") {
            const miscellaneousSection = formSectionMap.find(
                (filterSection) => filterSection.filterKey === "miscellaneous",
            );

            miscellaneousSection.options.requiresAttunement =
                "Requires Attunement";
        }

        return formSectionMap;
    }

    let filterSelections = {};

    filterStore.subscribe((store) => {
        filterSelections = store;
    });
</script>

{#each getFormSections() as { display, heading, filterKey, options }}
    {#if display ?? true}
        <CompendiumFilterCategory
            {filterKey}
            {filterSelections}
            {heading}
            {options}
            on:updateExclusiveMode={({ detail }) => {
                filterStore.update((currentFilterSelections) => ({
                    ...currentFilterSelections,
                    [filterKey]: {
                        inclusive: filterSelections[filterKey].inclusive,
                        inclusiveMode:
                            filterSelections[filterKey].inclusiveMode,
                        exclusive: filterSelections[filterKey].exclusive,
                        exclusiveMode: detail,
                    },
                }));
            }}
            on:updateInclusiveMode={({ detail }) => {
                filterStore.update((currentFilterSelections) => ({
                    ...currentFilterSelections,
                    [filterKey]: {
                        inclusive: filterSelections[filterKey].inclusive,
                        inclusiveMode: detail,
                        exclusive: filterSelections[filterKey].exclusive,
                        exclusiveMode:
                            filterSelections[filterKey].exclusiveMode,
                    },
                }));
            }}
            on:updateSelection={({ detail }) => {
                filterStore.update((currentFilterSelections) => ({
                    ...currentFilterSelections,
                    [filterKey]: {
                        inclusive: detail[0],
                        inclusiveMode:
                            filterSelections[filterKey].inclusiveMode,
                        exclusive: detail[1],
                        exclusiveMode:
                            filterSelections[filterKey].exclusiveMode,
                    },
                }));
            }}
        />
    {/if}
{/each}
