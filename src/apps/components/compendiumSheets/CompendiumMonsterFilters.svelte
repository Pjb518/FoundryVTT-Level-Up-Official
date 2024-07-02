<script>
    import { getContext } from "svelte";

    import CompendiumFilterCategory from "./CompendiumFilterCategory.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import RangeSlider from "svelte-range-slider-pips";

    export const compendiumType = "monster";

    const filterStore = getContext("filterStore");
    const { actorSizes, creatureTypes, terrainTypes } = CONFIG.A5E;

    const products = Object.entries(CONFIG.A5E.products).reduce((acc, [key, value]) => {
        acc[key] = value.title;
        return acc;
    }, {});

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
            filterKey: "terrain",
            heading: "Terrain",
            options: terrainTypes,
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
        {
            filterKey: "source",
            heading: "Source",
            options: products,
        },
    ];

    let filterSelections = {};

    filterStore.subscribe((store) => {
        filterSelections = store;
    });

    $: crRangeLabel = getChallengeRatingRangeLabel(filterSelections);
</script>

<FieldWrapper
    heading={`CR Range (${crRangeLabel})`}
    --a5e-field-wrapper-header-width="100%"
>
    <RangeSlider
        --range-handle="var(--a5e-color-primary)"
        --range-handle-focus="var(--a5e-color-primary)"
        --range-handle-inactive="var(--a5e-color-primary)"
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
</FieldWrapper>

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
