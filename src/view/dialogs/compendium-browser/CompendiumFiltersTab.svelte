<script lang="ts">
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import MultiStateCheckBoxGroup from "#view/snippets/MultiStateCheckBoxGroup.svelte";

    import { getFilterConfig } from "./utils/getFilterConfig.ts";

    type Props = {
        compendiumType: string;
        filterOptions: Record<string, any>;
    };

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
        filterOptions.selections = {
            ...filterOptions.selections,
            [filterKey]: {
                inclusive: detail[0],
                inclusiveMode: filterSelections[filterKey]?.inclusiveMode ?? 0,
                exclusive: detail[1],
                exclusiveMode: filterSelections[filterKey]?.exclusiveMode ?? 0,
            },
        };
    }

    let { compendiumType, filterOptions = $bindable() }: Props = $props();

    let filterSelections = $derived(filterOptions.selections);

    const formSections = getFilterConfig(compendiumType);
</script>

{#snippet FilterCategory(
    heading: string,
    options: Record<string, string>,
    filterKey: string,
    display: boolean,
)}
    <FieldWrapper>
        <header class="a5e-cb-filter-header">
            <h3 class="a5e-cb-filter-heading">{heading}</h3>

            <div class="a5e-cb-filter-mode-button-wrapper">
                <button
                    class="a5e-cb-filter-mode-button a5e-cb-filter-mode-button--inclusive"
                    data-tooltip="Toggle Inclusive Filter Mode"
                    data-tooltip-direction="UP"
                    onclick={() =>
                        onUpdateInclusiveMode(
                            !filterSelections[filterKey].inclusiveMode == 1,
                            filterKey,
                        )}
                >
                    {filterSelections[filterKey]?.inclusiveMode == 1
                        ? "AND"
                        : "OR"}
                </button>

                <button
                    class="a5e-cb-filter-mode-button a5e-cb-filter-mode-button--exclusive"
                    data-tooltip="Toggle Exclusive Filter Mode"
                    data-tooltip-direction="UP"
                    onclick={() =>
                        onUpdateExclusiveMode(
                            !filterSelections[filterKey].exclusiveMode == 1,
                            filterKey,
                        )}
                >
                    {filterSelections[filterKey]?.exclusiveMode == 1
                        ? "AND"
                        : "OR"}
                </button>
            </div>
        </header>
    </FieldWrapper>

    <MultiStateCheckBoxGroup
        color="red"
        options={Object.entries(options)}
        selected={[
            filterSelections[filterKey]?.inclusive ?? [],
            filterSelections[filterKey]?.exclusive ?? [],
        ]}
        onUpdateSelection={(e) => onUpdateFilterSelection(e, filterKey)}
    />
{/snippet}

<div class="a5e-cb-filter-tab">
    {#each formSections as { display, heading, filterKey, options }}
        {#if display ?? true}
            {@render FilterCategory(heading, options, filterKey, display)}
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
