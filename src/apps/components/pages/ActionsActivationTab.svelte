<script lang="ts">
    import type { Writable } from "svelte/store";
    import type { ItemA5e } from "../../../documents/item/item";

    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";
    import updateAssociatedValues from "../../handlers/updateAssociatedValues";

    import FieldWrapper from "../FieldWrapper.svelte";
    import Section from "../Section.svelte";

    const item: Writable<ItemA5e> = getContext("item");
    const actionId: string = getContext("actionId");

    const { A5E } = CONFIG;
    const specialActivationTypes = ["none", "special"];
    const specialTimeTypes = ["instantaneous", "permanent", "special"];

    $: action = $item.actions.get(actionId)!;
</script>

<Section heading="A5E.ActivationConfiguration" --a5e-section-body-gap="0.75rem">
    <FieldWrapper
        heading="A5E.ItemActivationCost"
        --a5e-field-wrapper-direction="row"
        --a5e-field-wrapper-header-width="100%"
    >
        {#if action.activation?.type && !specialActivationTypes.includes(action.activation?.type)}
            <input
                class="small-input"
                style="width: 5rem;"
                id={`${actionId}-activation-cost`}
                type="number"
                value={action.activation?.cost ?? 1}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        `system.actions.${actionId}.activation.cost`,
                        // @ts-expect-error
                        Number(target.value),
                    )}
            />
        {/if}

        <select
            class="u-w-fit"
            on:change={({ target }) =>
                updateAssociatedValues(
                    $item,
                    `system.actions.${actionId}.activation.type`,
                    // @ts-expect-error
                    target.value,
                    `system.actions.${actionId}.activation.cost`,
                    specialActivationTypes,
                )}
        >
            <option value="" />
            {#each Object.entries(A5E.abilityActivationTypes) as [value, label]}
                <option {value} selected={action.activation?.type === value}>
                    {localize(label)}
                </option>
            {/each}
        </select>
    </FieldWrapper>

    {#if action.activation?.type === "reaction"}
        <FieldWrapper heading="A5E.ActionActivationReactionTrigger">
            <div class="action-config__component">
                <input
                    class="full-size-input"
                    type="text"
                    value={action.activation?.reactionTrigger ?? ""}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $item,
                            `system.actions.${actionId}.activation.reactionTrigger`,
                            // @ts-expect-error
                            target.value,
                        )}
                />
            </div>
        </FieldWrapper>
    {/if}

    <FieldWrapper heading="A5E.ItemDuration">
        <div class="action-config__component">
            {#if action?.duration?.unit && !specialTimeTypes.includes(action?.duration?.unit)}
                <input
                    class="small-input"
                    style="width: 5rem;"
                    id={`${actionId}-duration-value`}
                    type="number"
                    value={action.duration?.value ?? 1}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $item,
                            `system.actions.${actionId}.duration.value`,
                            // @ts-expect-error
                            Number(target.value),
                        )}
                />
            {/if}

            <select
                class="u-w-fit"
                on:change={({ target }) =>
                    updateAssociatedValues(
                        $item,
                        `system.actions.${actionId}.duration.unit`,
                        // @ts-expect-error
                        target.value,
                        `system.actions.${actionId}.duration.value`,
                        specialTimeTypes,
                    )}
            >
                <option value="" />
                {#each Object.entries(A5E.timePeriods) as [value, label]}
                    <option {value} selected={action?.duration?.unit === value}>
                        {localize(label)}
                    </option>
                {/each}
            </select>
        </div>
    </FieldWrapper>
</Section>
