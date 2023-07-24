<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import getOrdinalNumber from "../../../utils/getOrdinalNumber";
    import isStandardRange from "../../../utils/isStandardRange";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import Checkbox from "../Checkbox.svelte";
    import FormSection from "../FormSection.svelte";
    import RadioGroup from "../RadioGroup.svelte";

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

    const heading = localize("A5E.ItemRangeIncrement", {
        increment: getOrdinalNumber(index + 1),
    });

    const options = Object.entries(CONFIG.A5E.rangeDescriptors).map(
        ([value, label]) => {
            if (["short", "medium", "long"].includes(value)) {
                const range = CONFIG.A5E.rangeValues[value];
                return [value, `${localize(label)} (${range} ft.)`];
            }

            return [value, label];
        }
    );

    let customValue = isStandardRange(range) ? "" : range;
    let includeUnit = rangeObject.unit ? true : false;

    $: selected = isStandardRange(range) ? range : "other";
</script>

<FormSection --direction="column" --gap="0.75rem">
    <FormSection
        {heading}
        --background="none"
        --direction="column"
        --padding="0"
        --gap="0.375rem"
    >
        <RadioGroup
            {options}
            {selected}
            on:updateSelection={({ detail }) => updateRangeValue(detail)}
        />
    </FormSection>

    {#if selected === "other"}
        <Checkbox
            label="A5E.IncludeUnit"
            checked={includeUnit}
            on:updateSelection={(event) => {
                includeUnit = event.detail;
                deleteRangeUnit(event);
            }}
        />

        <FormSection
            hint={includeUnit
                ? "When units are selected range must be a number."
                : null}
            --background="none"
            --direction="row"
            --gap="0.5rem"
            --padding="0"
            --item-alignment="center"
        >
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
        </FormSection>
    {/if}

    <button
        class="delete-button fas fa-trash"
        data-tooltip="Delete Range Increment"
        data-tooltip-direction="UP"
        on:click={deleteRangeIncrement}
    />
</FormSection>

<style lang="scss">
    .delete-button {
        position: absolute;
        top: 0.75rem;
        right: 0.75rem;
        width: fit-content;
        padding: 0.25rem;
        font-size: 1rem;
        color: #999;
        background: none;
        cursor: pointer;

        transition: all 0.15s ease-in-out;

        &:hover {
            box-shadow: none;
            transform: scale(1.2);
            color: #8b2525;
        }
    }
</style>
