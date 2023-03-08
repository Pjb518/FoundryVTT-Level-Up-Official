<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import getOrdinalNumber from "../../../utils/getOrdinalNumber";
    import isStandardRange from "../../../utils/isStandardRange";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    import FormSection from "../FormSection.svelte";

    export let index;
    export let id;
    export let rangeObject;
    let range = rangeObject.range;

    const item = getContext("item");
    const actionId = getContext("actionId");
    const A5E = CONFIG.A5E;

    function updateRangeValue(option) {
        range = isStandardRange(option) ? option : customValue;
        if (includeUnit) range = Number(range);

        updateDocumentDataFromField(
            $item,
            `system.actions.${actionId}.ranges.${id}.range`,
            range
        );
    }

    function selectRangeUnit(event) {
        const selectedOption = event.target?.selectedOptions[0]?.value;

        if (selectedOption === "null") {
            $item.update({
                [`system.actions.${actionId}.ranges.${id}`]: {
                    "-=unit": null,
                },
            });
        } else {
            $item.update({
                [`system.actions.${actionId}.ranges.${id}`]: {
                    unit: selectedOption,
                },
            });
        }
    }

    function deleteRangeUnit(event) {
        const checked = event.target?.checked;
        if (checked === true) return;
        $item.update({
            [`system.actions.${actionId}.ranges.${id}`]: {
                "-=unit": null,
            },
        });
    }

    function deleteRangeIncrement(event) {
        const { rangeId } = event.target.closest(".range-increment").dataset;

        $item.update({
            [`system.actions.${actionId}.ranges`]: {
                [`-=${rangeId}`]: null,
            },
        });
    }

    const heading = game.i18n.format("A5E.ItemRangeIncrement", {
        increment: getOrdinalNumber(index + 1),
    });

    const options = Object.entries(CONFIG.A5E.rangeDescriptors).map(
        ([value, label]) => {
            if (["short", "medium", "long"].includes(value)) {
                const range = CONFIG.A5E.rangeValues[value];
                return [value, `${game.i18n.localize(label)} (${range} ft.)`];
            }

            return [value, label];
        }
    );

    let customValue = isStandardRange(range) ? "" : range;
    let includeUnit = rangeObject.unit ? true : false;
    $: selected = isStandardRange(range) ? range : "other";
</script>

<FormSection {heading}>
    <div class="action-config__wrapper">
        <ul
            class="u-flex u-flex-wrap u-gap-sm u-list-style-none u-m-0 u-p-0 u-text-xs u-w-full"
        >
            {#each options as [value, label]}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <li
                    class="a5e-tag u-pointer"
                    class:a5e-tag--active={selected === value ||
                        selected?.toString() === value}
                    on:click={() => updateRangeValue(value)}
                >
                    {localize(label)}
                </li>
            {/each}
        </ul>

        {#if selected === "other"}
            <div class="u-flex u-gap-md u-align-center">
                <input
                    id="{actionId}-{id}-include-unit"
                    type="checkbox"
                    bind:checked={includeUnit}
                    on:change={deleteRangeUnit}
                />
                <label for="{actionId}-{id}-include-unit">
                    {localize("A5E.IncludeUnit")}
                </label>
            </div>

            <div class="u-align-center u-flex u-gap-md">
                <input
                    class:small-input={includeUnit}
                    type="text"
                    bind:value={customValue}
                    on:change={() => updateRangeValue(customValue)}
                />

                {#if includeUnit}
                    <select
                        class="u-w-30"
                        name="system.actions.${actionId}.ranges.{id}.unit"
                        on:change={selectRangeUnit}
                    >
                        <option value={null}>{localize("A5E.None")}</option>
                        {#each Object.entries(A5E.distanceUnits) as [unit, label]}
                            <option
                                value={unit}
                                selected={rangeObject.unit === unit}
                            >
                                {localize(label)}
                            </option>
                        {/each}
                    </select>
                {/if}
            </div>
        {/if}

        <!-- TODO: Unable to add tooltip for some reason -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <i
            class="delete-button fas fa-trash"
            role="button"
            on:click={deleteRangeIncrement}
        />
    </div>
</FormSection>

<style lang="scss">
    .delete-button {
        position: absolute;
        top: 0.275rem;
        right: 0.275rem;
        color: #999;
        padding: 0.25rem;
        cursor: pointer;
        transition: all 0.15s ease-in-out;

        &:hover {
            transform: scale(1.2);
            color: #8b2525;
        }
    }
</style>
