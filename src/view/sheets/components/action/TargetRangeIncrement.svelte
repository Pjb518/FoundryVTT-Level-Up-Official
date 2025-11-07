<script lang="ts">
    import type { Action } from "#types/action.js";

    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import { getOrdinalNumber } from "#utils/getOrdinalNumber.ts";
    import { isStandardRange } from "#utils/isStandardRange.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";
    import Section from "#view/snippets/Section.svelte";

    type Props = {
        index: number;
        id: string;
    };

    function deleteRangeIncrement() {
        item.update({
            [`system.actions.${actionId}.ranges`]: {
                [`-=${id}`]: null,
            },
        });
    }

    function deleteRangeUnit(checked: boolean) {
        if (checked === true) return;

        item.update({
            [`system.actions.${actionId}.ranges.${id}`]: {
                "-=unit": null,
            },
        });
    }

    function selectRangeUnit(selectedOption: string) {
        if (selectedOption === "null") {
            item.update({
                [`system.actions.${actionId}.ranges.${id}`]: {
                    "-=unit": null,
                },
            });
        } else {
            item.update({
                [`system.actions.${actionId}.ranges.${id}`]: {
                    unit: selectedOption,
                },
            });
        }
    }

    function updateRangeValue(option: string) {
        const isStandard = isStandardRange(option);

        if (isStandard) {
            range = option;
            customValue = "";
        } else if (includeUnit) range = Number.parseInt(option, 10);
        else range = customValue;

        updateDocumentDataFromField(
            item,
            `system.actions.${actionId}.ranges.${id}.range`,
            range,
        );
    }

    let { index, id }: Props = $props();

    let actor: any = getContext("actor");
    let item: any = getContext("item");
    let actionId: string = getContext("actionId");
    let action: Action = $derived(item.reactive.actions.get(actionId));

    let rangeObject = $derived(action.ranges[id]);
    let range = $derived(rangeObject.range);

    const { A5E } = CONFIG;

    let heading = $derived(
        localize("A5E.actions.labels.rangeIncrement", {
            increment: getOrdinalNumber(index + 1),
        }),
    );

    const options = Object.entries(CONFIG.A5E.rangeDescriptors).map(([value, label]) => {
        if (["short", "medium", "long"].includes(value)) {
            const range = CONFIG.A5E.rangeValues[value];
            return [value, `${localize(label as string)} (${range} ft.)`];
        }

        return [value, label];
    }) as string[][];

    let includeUnit = $derived(!!rangeObject.unit);
    let customValue = $derived(isStandardRange(range) ? (includeUnit ? "" : 0) : range);
    let selected = $derived(isStandardRange(range) ? range : "other");
</script>

<RadioGroup
    buttons={[
        {
            classes: "icon fa-solid fa-trash a5e-field-wrapper__header-button--scale",
            handler: deleteRangeIncrement,
            tooltip: "Delete Range Increment",
        },
    ]}
    {heading}
    {options}
    {selected}
    onUpdateSelection={(value) => updateRangeValue(value)}
    --a5e-field-wrapper-header-width="100%"
    --a5e-field-wrapper-label-width="100%"
    --a5e-header-button-color="rgba(0, 0, 0, 0.2)"
    --a5e-header-button-color-hover="#555"
/>

{#if selected === "other"}
    <Checkbox
        label="A5E.actions.labels.includeUnit"
        checked={includeUnit}
        onUpdateSelection={(checked) => {
            includeUnit = checked;
            deleteRangeUnit(includeUnit);
        }}
    />

    <Section
        hint={includeUnit ? "When units are selected range must be a number." : ""}
        --a5e-section-body-padding="0"
        --a5e-section-body-direction="row"
        --a5e-section-body-gap="0.5rem"
        --a5e-section-body-hint-width="100%"
    >
        <input
            class="a5e-input a5e-input--slim"
            class:a5e-input--small={includeUnit}
            type={includeUnit ? "number" : "text"}
            value={customValue}
            onchange={({ currentTarget }) => {
                customValue = currentTarget.value;
                updateRangeValue(currentTarget.value);
            }}
        />

        {#if includeUnit}
            <select
                class="a5e-input a5e-input--slim a5e-input--fit"
                name="system.actions.${actionId}.ranges.{id}.unit"
                onchange={({ currentTarget }) => {
                    selectRangeUnit(currentTarget.value);
                }}
            >
                <option value={null}>{localize("A5E.None")}</option>
                {#each Object.entries(A5E.distanceUnits) as [unit, label]}
                    <option value={unit} selected={rangeObject.unit === unit}>
                        {localize(label as string)}
                    </option>
                {/each}
            </select>
        {/if}
    </Section>
{/if}
