<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";
    import updateAssociatedValues from "../../handlers/updateAssociatedValues";

    import FormSection from "../FormSection.svelte";

    const item = getContext("item");
    const actionId = getContext("actionId");

    const A5E = CONFIG.A5E;
    const specialActivationTypes = ["none", "special"];
    const specialTimeTypes = ["instantaneous", "permanent", "special"];

    $: action = $item.system.actions[actionId];
</script>

<section class="action-config action-config__wrapper">
    <section class="action-config action-config__section">
        <header class="action-config__section-header">
            <h2 class="action-config__section-heading">
                {localize("A5E.ActivationConfiguration")}
            </h2>
        </header>

        <FormSection heading="A5E.ItemActivationCost">
            <div class="action-config__component">
                {#if action.activation?.type && !specialActivationTypes.includes(action.activation?.type)}
                    <input
                        class="small-input"
                        id={`${actionId}-activation-cost`}
                        name={`${actionId}-activation-cost`}
                        type="number"
                        value={action.activation?.cost ?? 1}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $item,
                                `system.actions.${actionId}.activation.cost`,
                                Number(target.value)
                            )}
                    />
                {/if}

                <select
                    class="u-w-fit"
                    name={`system.actions.${actionId}.activation.type`}
                    on:change={({ target }) =>
                        updateAssociatedValues(
                            $item,
                            target.name,
                            target.value,
                            `system.actions.${actionId}.activation.cost`,
                            specialActivationTypes
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
            </div>
        </FormSection>

        {#if action.activation?.type === "reaction"}
            <FormSection heading="A5E.ActionActivationReactionTrigger">
                <div class="action-config__component">
                    <input
                        class="full-size-input"
                        type="text"
                        name={`system.actions.${actionId}.activation.reactionTrigger`}
                        value={action.activation?.reactionTrigger ?? ""}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $item,
                                target.name,
                                target.value
                            )}
                    />
                </div>
            </FormSection>
        {/if}

        <FormSection heading="A5E.ItemDuration">
            <div class="action-config__component">
                {#if action?.duration?.unit && !specialTimeTypes.includes(action?.duration?.unit)}
                    <input
                        class="small-input"
                        id={`${actionId}-duration-value`}
                        name={`${actionId}-duration-value`}
                        type="number"
                        value={action.duration?.value ?? 1}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $item,
                                `system.actions.${actionId}.duration.value`,
                                Number(target.value)
                            )}
                    />
                {/if}

                <select
                    class="u-w-fit"
                    name={`system.actions.${actionId}.duration.unit`}
                    on:change={({ target }) =>
                        updateAssociatedValues(
                            $item,
                            target.name,
                            target.value,
                            `system.actions.${actionId}.duration.value`,
                            specialTimeTypes
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
        </FormSection>
    </section>
</section>
