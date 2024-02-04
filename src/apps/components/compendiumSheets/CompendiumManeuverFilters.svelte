<script>
    import { getContext } from "svelte";

    import CompendiumFilterCategory from "./CompendiumFilterCategory.svelte";
    import FormSection from "../LegacyFormSection.svelte";
    import RangeSlider from "svelte-range-slider-pips";

    const filterStore = getContext("filterStore");
    const { maneuverDegrees, maneuverTraditions } = CONFIG.A5E;

    function getExertionCostLabel({ exertion }) {
        const { min, max } = exertion;

        if (min === max) return min;

        return `${min}–${max}`;
    }

    function updateExertionRange([min, max]) {
        filterStore.update((currentFilterSelections) => ({
            ...currentFilterSelections,
            exertion: { min, max },
        }));
    }

    let filterSelections = {};

    filterStore.subscribe((store) => {
        filterSelections = store;
    });

    const formSectionMap = [
        {
            filterKey: "maneuverDegrees",
            heading: "Maneuver Degrees",
            options: maneuverDegrees,
        },
        {
            filterKey: "maneuverTraditions",
            heading: "Maneuver Traditions",
            options: maneuverTraditions,
        },
        {
            filterKey: "miscellaneous",
            heading: "Miscellaneous",
            options: {
                concentration: "Concentration",
                stance: "Stance",
            },
        },
    ];

    $: exertionCostLabel = getExertionCostLabel(filterSelections);
</script>

<FormSection
    heading="Exertion Cost Range ({exertionCostLabel})"
    --label-width="100%"
>
    <RangeSlider
        --range-handle="#425f65"
        --range-handle-focus="#425f65"
        --range-handle-inactive="#425f65"
        --range-pip="#7e7960"
        --range-slider="#c8c6be"
        first={"label"}
        last={"label"}
        min={0}
        max={6}
        pips={true}
        pipstep={1}
        range={true}
        springValues={{ stiffness: 1, damping: 1 }}
        step={1}
        values={[filterSelections.exertion.min, filterSelections.exertion.max]}
        on:change={({ detail }) => updateExertionRange(detail.values)}
    />
</FormSection>

{#each formSectionMap as { display, heading, filterKey, options }}
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
