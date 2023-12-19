<script>
    import { getContext } from "svelte";

    import CompendiumFilterCategory from "./CompendiumFilterCategory.svelte";
    import FormSection from "../FormSection.svelte";
    import RangeSlider from "svelte-range-slider-pips";

    export const compendiumType = "maneuver";

    const filterStore = getContext("filterStore");
    const { actorSizes, creatureTypes } = CONFIG.A5E;

    function getChallengeRatingRangeLabel({ cr }) {
        const { min, max } = cr;

        if (min === max) return min;

        return `${min}–${max}`;
    }

    function updateChallengeRatingRange([min, max]) {
        filterStore.update((currentFilterSelections) => ({
            ...currentFilterSelections,
            cr: { min, max },
        }));
    }

    const formSectionMap = [
        {
            filterKey: "creatureTypes",
            heading: "Creature Types",
            options: creatureTypes,
        },
        {
            filterKey: "creatureSize",
            heading: "Creature Size",
            options: actorSizes,
        },
        {
            filterKey: "miscellaneous",
            heading: "Miscellaneous",
            options: {
                elite: "Elite",
                swarm: "Swarm",
            },
        },
    ];

    let filterSelections = {};

    filterStore.subscribe((store) => {
        filterSelections = store;
    });

    $: crRangeLabel = getChallengeRatingRangeLabel(filterSelections);
</script>

<FormSection heading={`CR Range (${crRangeLabel})`} --label-width="100%">
    <RangeSlider
        --range-handle="#425f65"
        --range-handle-focus="#425f65"
        --range-handle-inactive="#425f65"
        --range-pip="#7e7960"
        --range-slider="#c8c6be"
        first={"label"}
        last={"label"}
        min={0}
        max={30}
        pips={true}
        pipstep={1}
        range={true}
        springValues={{ stiffness: 1, damping: 1 }}
        step={1}
        values={[filterSelections.cr.min, filterSelections.cr.max]}
        on:change={({ detail }) => updateChallengeRatingRange(detail.values)}
    />
</FormSection>

{#each formSectionMap as { heading, filterKey, options }}
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
{/each}
