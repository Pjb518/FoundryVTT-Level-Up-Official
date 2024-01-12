<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import getOrdinalNumber from "../../../utils/getOrdinalNumber";
    import isStandardRange from "../../../utils/isStandardRange";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import Checkbox from "../Checkbox.svelte";
    import RadioGroup from "../RadioGroup.svelte";
    import Section from "../Section.svelte";

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
            range,
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

    function deleteRangeIncrement() {
        $item.update({
            [`system.actions.${actionId}.ranges`]: {
                [`-=${id}`]: null,
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
        },
    );

    let customValue = isStandardRange(range) ? "" : range;
    let includeUnit = rangeObject.unit ? true : false;

    $: selected = isStandardRange(range) ? range : "other";
</script>

<RadioGroup
    buttons={[
        {
            classes:
                "fa-solid fa-trash a5e-field-wrapper__header-button--scale",
            handler: deleteRangeIncrement,
            tooltip: "Delete Range Increment",
        },
    ]}
    {heading}
    {options}
    {selected}
    on:updateSelection={({ detail }) => updateRangeValue(detail)}
    --a5e-field-wrapper-header-width="100%"
    --a5e-field-wrapper-label-width="100%"
    --a5e-header-button-color="rgba(0, 0, 0, 0.2)"
    --a5e-header-button-color-hover="#555"
/>

{#if selected === "other"}
    <Checkbox
        label="A5E.IncludeUnit"
        checked={includeUnit}
        on:updateSelection={(event) => {
            includeUnit = event.detail;
            deleteRangeUnit(event);
        }}
    />

    <Section
        hint={includeUnit
            ? "When units are selected range must be a number."
            : null}
        --a5e-section-body-padding="0"
    >
        <div style="display: flex; gap: 0.5rem; flex-wrap: nowrap">
            <input
                style="flex-shrink: 1;"
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
    </Section>
{/if}
