<script>
    import { getContext } from "svelte";

    import CompendiumFilterCategory from "./CompendiumFilterCategory.svelte";

    export let compendiumType = "class";

    const filterStore = getContext("filterStore");
    const { classes } = CONFIG.A5E;

    const products = Object.entries(CONFIG.A5E.products).reduce((acc, [key, value]) => {
        acc[key] = value.title;
        return acc;
    }, {});

    function getFormSections() {
        const formSectionMap = [
            {
                filterKey: "classes",
                heading: "Class",
                options: classes,
            },
            {
                filterKey: "source",
                heading: "Source",
                options: products,
            },
        ];

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
                        inclusiveMode: filterSelections[filterKey].inclusiveMode,
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
                        exclusiveMode: filterSelections[filterKey].exclusiveMode,
                    },
                }));
            }}
            on:updateSelection={({ detail }) => {
                filterStore.update((currentFilterSelections) => ({
                    ...currentFilterSelections,
                    [filterKey]: {
                        inclusive: detail[0],
                        inclusiveMode: filterSelections[filterKey].inclusiveMode,
                        exclusive: detail[1],
                        exclusiveMode: filterSelections[filterKey].exclusiveMode,
                    },
                }));
            }}
        />
    {/if}
{/each}
