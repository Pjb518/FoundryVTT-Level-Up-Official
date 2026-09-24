<script lang="ts">
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import GroupedMultiStateCheckBoxGroup from "#view/snippets/GroupedMultiStateCheckBoxGroup.svelte";
    import MultiStateCheckBoxGroup from "#view/snippets/MultiStateCheckBoxGroup.svelte";
    import RangeSlider from "svelte-range-slider-pips";

    import { getFilterConfig } from "./utils/getFilterConfig.ts";

    type Props = {
        compendiumType: string;
        filterOptions: Record<string, any>;
    };

    const FEAT_ONLY_FILTERS = ["asi", "featClasses", "featType", "synergy"];

    function onUpdateExclusiveMode(detail, filterKey) {
        filterOptions.selections = {
            ...filterOptions.selections,
            [filterKey]: {
                inclusive: filterSelections[filterKey]?.inclusive ?? [],
                inclusiveMode: filterSelections[filterKey]?.inclusiveMode ?? 0,
                exclusive: filterSelections[filterKey]?.exclusive ?? [],
                exclusiveMode: detail,
            },
        };
    }

    function onUpdateInclusiveMode(detail, filterKey) {
        filterOptions.selections = {
            ...filterOptions.selections,
            [filterKey]: {
                inclusive: filterSelections[filterKey]?.inclusive ?? [],
                inclusiveMode: detail,
                exclusive: filterSelections[filterKey]?.exclusive ?? [],
                exclusiveMode: filterSelections[filterKey]?.exclusiveMode ?? 0,
            },
        };
    }

    function onUpdateFilterSelection(detail, filterKey) {
        const wasFeatSelected =
            filterSelections["featureType"]?.inclusive?.includes("feat") ?? false;

        const isFeatSelected =
            filterKey === "featureType"
                ? (detail[0] as string[]).includes("feat")
                : wasFeatSelected;

        const clearedFeatFilters =
            filterKey === "featureType" && wasFeatSelected && !isFeatSelected
                ? Object.fromEntries(FEAT_ONLY_FILTERS.map((k) => [k, undefined]))
                : {};

        // "source" holds exactly one value per document, so OR-combining multiple `!==` exclusions
        // (the default exclusiveMode) is a no-op - at most one of them can ever be false for a given
        // doc, so `.some()` is true for virtually everything. AND is the only combinator that
        // actually excludes every selected source, and it's correct even when 0 or 1 are excluded,
        // so it's forced here rather than left to the (otherwise general-purpose) AND/OR toggle.
        const exclusiveMode =
            filterKey === "source" ? 1 : (filterSelections[filterKey]?.exclusiveMode ?? 0);

        filterOptions.selections = {
            ...filterOptions.selections,
            ...clearedFeatFilters,
            [filterKey]: {
                inclusive: detail[0],
                inclusiveMode: filterSelections[filterKey]?.inclusiveMode ?? 0,
                exclusive: detail[1],
                exclusiveMode,
            },
        };
    }

    let { compendiumType, filterOptions = $bindable() }: Props = $props();

    let filterSelections = $derived(filterOptions.selections);

    let formSections = $derived(getFilterConfig(compendiumType, filterSelections));
</script>

{#snippet FilterCategory(
    heading: string,
    options: Record<string, string>,
    filterKey: string,
    display: boolean,
    type: string | undefined,
)}
    <FieldWrapper>
        <header class="a5e-cb-filter-header">
            <h3 class="a5e-cb-filter-heading">{heading}</h3>

            <div class="a5e-cb-filter-mode-button-wrapper">
                <button
                    type="button"
                    class="a5e-cb-filter-mode-button a5e-cb-filter-mode-button--inclusive"
                    data-tooltip="Toggle Inclusive Filter Mode"
                    data-tooltip-direction="UP"
                    onclick={() =>
                        onUpdateInclusiveMode(
                            !filterSelections[filterKey].inclusiveMode == 1,
                            filterKey,
                        )}
                >
                    {filterSelections[filterKey]?.inclusiveMode == 1 ? "AND" : "OR"}
                </button>

                <button
                    type="button"
                    class="a5e-cb-filter-mode-button a5e-cb-filter-mode-button--exclusive"
                    data-tooltip="Toggle Exclusive Filter Mode"
                    data-tooltip-direction="UP"
                    onclick={() =>
                        onUpdateExclusiveMode(
                            !filterSelections[filterKey].exclusiveMode == 1,
                            filterKey,
                        )}
                >
                    {filterSelections[filterKey]?.exclusiveMode == 1 ? "AND" : "OR"}
                </button>
            </div>
        </header>
    </FieldWrapper>

    {#if type === "sourceTree"}
        <GroupedMultiStateCheckBoxGroup
            color="red"
            tree={options}
            selected={[
                filterSelections[filterKey]?.inclusive ?? [],
                filterSelections[filterKey]?.exclusive ?? [],
            ]}
            onUpdateSelection={(e) => onUpdateFilterSelection(e, filterKey)}
        />
    {:else}
        <MultiStateCheckBoxGroup
            color="red"
            options={Object.entries(options)}
            selected={[
                filterSelections[filterKey]?.inclusive ?? [],
                filterSelections[filterKey]?.exclusive ?? [],
            ]}
            onUpdateSelection={(e) => onUpdateFilterSelection(e, filterKey)}
        />
    {/if}
{/snippet}

<div class="a5e-cb-filter-tab">
    {#each formSections as { display, heading, filterKey, options, type }}
        {#if type && type === "range"}
            {@const rangeMin = filterSelections?.[filterKey]?.min ?? options.min}
            {@const rangeMax = filterSelections?.[filterKey]?.max ?? options.max}

            <FieldWrapper
                heading="{heading} ({rangeMin}-{rangeMax})"
                --a5e-field-wrapper-header-width="100%"
            >
                <RangeSlider
                    --range-handle="var(--a5e-color-primary)"
                    --range-handle-focus="var(--a5e-color-primary)"
                    --range-handle-inactive="var(--a5e-color-primary)"
                    --range-pip="var(--a5e-color-text-medium)"
                    --range-slider="#c8c6be"
                    first={"label"}
                    last={"label"}
                    min={options.min}
                    max={options.max}
                    pips={true}
                    pipstep={1}
                    range={true}
                    springValues={{ stiffness: 1, damping: 1 }}
                    step={1}
                    values={[
                        filterSelections?.[filterKey]?.min ?? options.min,
                        filterSelections?.[filterKey]?.max ?? options.max,
                    ]}
                    on:change={({ detail }) =>
                        (filterSelections[filterKey] = {
                            min: detail.values[0],
                            max: detail.values[1],
                        })}
                ></RangeSlider>
            </FieldWrapper>
        {:else if display ?? true}
            {@render FilterCategory(heading, options, filterKey, display, type)}
        {/if}
    {/each}
</div>

<style lang="scss">
    .a5e-cb-filter {
        &-tab {
            margin-block: 0.75rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            max-height: 70vh;
            overflow-y: auto;
        }

        &-header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.125rem;
        }

        &-heading {
            flex-shrink: 0;
            margin: 0;
            font-size: var(--a5e-sm-text);
            font-weight: bold;
            border-bottom: 0;
        }

        &-mode-button {
            justify-self: flex-end;
            width: fit-content;
            margin: 0;
            padding: 0.125rem 0.5rem;
            font-size: var(--a5e-xs-text);
            font-weight: bold;
            line-height: 1;
            background: transparent;

            &:hover,
            &:focus {
                box-shadow: none;
            }

            &--exclusive {
                color: var(--a5e-color-error);
                border-left: 0;
                border-radius: 0 3px 3px 0;
            }

            &--inclusive {
                color: var(--a5e-color-primary);
                border-right: 1px solid var(--a5e-border-color);
                border-radius: 3px 0 0 3px;
            }

            &-wrapper {
                display: flex;
            }
        }
    }
</style>
