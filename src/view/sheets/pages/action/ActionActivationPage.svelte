<script lang="ts">
    import type { Action } from "#types/action.js";
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import { getDeterministicBonus } from "../../../../dice/getDeterministicBonus.ts";
    import { updateAssociatedValues } from "#utils/view/updateAssociatedValues.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";

    function getDurationHeadingLabel(action: Action): string {
        if (!action.duration?.unit) return "A5E.actions.headings.duration";
        if (
            action.duration?.unit === "instantaneous" ||
            action.duration?.unit === "permanent" ||
            action.duration?.unit === "special"
        ) {
            return "A5E.actions.headings.duration";
        } else return "A5E.actions.headings.durationFormula";
    }

    let actor: any = getContext("actor");
    let item: any = getContext("item");
    let actionId: string = getContext("actionId");
    let action: Action = $derived(item.reactive.actions.get(actionId));

    const { A5E } = CONFIG;
    const specialActivationTypes = ["none", "special"];
    const specialTimeTypes = ["instantaneous", "permanent", "special"];

    let numericDurationValue = $derived(
        actor
            ? (getDeterministicBonus(
                  action?.duration?.value ?? "0",
                  actor.reactive.getRollData(item.reactive),
              ) ?? 0)
            : 0,
    );
</script>

<Section
    heading="A5E.actions.headings.activation.configuration"
    --a5e-section-body-gap="0.75rem"
>
    <FieldWrapper
        heading="A5E.actions.headings.activation.cost"
        --a5e-field-wrapper-direction="row"
        --a5e-field-wrapper-header-width="100%"
    >
        {#if action.activation?.type && !specialActivationTypes.includes(action.activation?.type)}
            <input
                class="a5e-input a5e-input--small a5e-input--slim"
                id="{actionId}-activation-cost"
                type="number"
                value={action.activation?.cost ?? 1}
                onchange={({ currentTarget }) =>
                    updateDocumentDataFromField(
                        item,
                        `system.actions.${actionId}.activation.cost`,
                        Number(currentTarget.value),
                    )}
            />
        {/if}

        <select
            class="a5e-input a5e-input--slim a5e-input--fit"
            onchange={({ currentTarget }) =>
                updateAssociatedValues(
                    item,
                    `system.actions.${actionId}.activation.type`,
                    currentTarget.value,
                    `system.actions.${actionId}.activation.cost`,
                    specialActivationTypes,
                )}
        >
            <option value=""></option>

            {#each Object.entries(A5E.abilityActivationTypes) as [value, label]}
                <option {value} selected={action.activation?.type === value}>
                    {localize(label as string)}
                </option>
            {/each}
        </select>
    </FieldWrapper>

    {#if action.activation?.type === "reaction"}
        <FieldWrapper heading="A5E.actions.headings.activation.reactionTrigger">
            <input
                class="a5e-input a5e-input--slim"
                type="text"
                value={action.activation?.reactionTrigger ?? ""}
                onchange={({ currentTarget }) =>
                    updateDocumentDataFromField(
                        item,
                        `system.actions.${actionId}.activation.reactionTrigger`,
                        currentTarget.value,
                    )}
            />
        </FieldWrapper>
    {/if}

    <FieldWrapper
        heading={getDurationHeadingLabel(action)}
        --a5e-field-wrapper-direction="row"
        --a5e-field-wrapper-header-width="100%"
    >
        {#if action?.duration?.unit && !specialTimeTypes.includes(action?.duration?.unit)}
            <input
                class="a5e-input a5e-input--slim"
                style="width: 15rem;"
                id={`${actionId}-duration-value`}
                type="text"
                value={action.duration?.value ?? "1"}
                onchange={({ currentTarget }) =>
                    updateDocumentDataFromField(
                        item,
                        `system.actions.${actionId}.duration.value`,
                        currentTarget.value,
                    )}
            />

            {#if item?.actor}
                <input
                    class="a5e-input a5e-input--slim"
                    style="width: 2rem; text-align: center;"
                    type="number"
                    value={numericDurationValue}
                    disabled
                />
            {/if}
        {/if}

        <select
            class="a5e-input a5e-input--slim a5e-input--fit"
            onchange={({ currentTarget }) =>
                updateAssociatedValues(
                    item,
                    `system.actions.${actionId}.duration.unit`,
                    currentTarget.value,
                    `system.actions.${actionId}.duration.value`,
                    specialTimeTypes,
                    "1",
                )}
        >
            <option value=""></option>

            {#each Object.entries(A5E.timePeriods) as [value, label]}
                <option {value} selected={action?.duration?.unit === value}>
                    {localize(label as string)}
                </option>
            {/each}
        </select>
    </FieldWrapper>
</Section>
