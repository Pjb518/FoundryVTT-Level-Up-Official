<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";
    import updateAssociatedValues from "../../handlers/updateAssociatedValues";

    import FieldWrapper from "../FieldWrapper.svelte";
    import Section from "../Section.svelte";

    const item = getContext("item");
    const actionId = getContext("actionId");

    const { A5E } = CONFIG;
    const specialActivationTypes = ["none", "special"];
    const specialTimeTypes = ["instantaneous", "permanent", "special"];

    $: action = $item.actions[actionId];
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
                    target.value,
                    `system.actions.${actionId}.activation.cost`,
                    specialActivationTypes,
                )}
        >
            <option value="" />
            {#each Object.entries(A5E.abilityActivationTypes) as [value, label]}
                <option
                    key={value}
                    {value}
                    selected={action.activation?.type === value}
                >
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
                        target.value,
                        `system.actions.${actionId}.duration.value`,
                        specialTimeTypes,
                    )}
            >
                <option value="" />
                {#each Object.entries(A5E.timePeriods) as [value, label]}
                    <option
                        key={value}
                        {value}
                        selected={action?.duration?.unit === value}
                    >
                        {localize(label)}
                    </option>
                {/each}
            </select>
        </div>
    </FieldWrapper>
</Section>
