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
    const rechargeTypes = {
        none: "A5E.None",
        item: "A5E.Item",
        action: "A5E.Action",
    };

    function updateRecharge(value) {
        if (["none", "item"].includes(value)) {
            $item.update({
                [`system.actions.${actionId}.recharge`]: {
                    type: value,
                    [`-=formula`]: null,
                    [`-=threshold`]: null,
                },
            });
        }

        if (value === "action") {
            $item.update({
                [`system.actions.${actionId}.recharge`]: {
                    type: value,
                    formula: "1d6",
                    threshold: 6,
                },
            });
        }
    }

    $: action = $item.actions[actionId];
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
                    on:change={({ target }) =>
                        updateAssociatedValues(
                            $item,
                            `system.actions.${actionId}.activation.type`,
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
                        value={action.activation?.reactionTrigger ?? ""}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $item,
                                `system.actions.${actionId}.activation.reactionTrigger`,
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
                    on:change={({ target }) =>
                        updateAssociatedValues(
                            $item,
                            `system.actions.${actionId}.duration.unit`,
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

        <FormSection heading="A5E.ItemRechargeConfiguration">
            <div class="action-config__wrapper">
                <div class="a5e-field-group">
                    <label for="{actionId}-recharge-type">
                        {localize("A5E.ItemRechargeType")}
                    </label>

                    <select
                        id="{actionId}-recharge-type"
                        class="u-w-fit"
                        on:change={({ target }) => updateRecharge(target.value)}
                    >
                        {#each Object.entries(rechargeTypes) as [value, label]}
                            <option
                                key={value}
                                value={value ?? "none"}
                                selected={action?.recharge?.type === value}
                            >
                                {localize(label)}
                            </option>
                        {/each}
                    </select>
                </div>

                {#if action.recharge?.type === "action"}
                    <div class="row">
                        <div
                            class="a5e-field-group a5e-field-group--formula u-flex-grow"
                        >
                            <label for="{actionId}-recharge-formula">
                                {localize("A5E.ItemRechargeFormula")}
                            </label>

                            <input
                                id="{actionId}-recharge-formula"
                                type="text"
                                value={action?.recharge?.formula ?? "1d6"}
                                on:change={({ target }) =>
                                    updateDocumentDataFromField(
                                        $item,
                                        `system.actions.${actionId}.recharge.formula`,
                                        target.value
                                    )}
                            />
                        </div>

                        <!-- Threshold -->
                        <div class="a5e-field-group u-w-30">
                            <label for="{actionId}-recharge-formula">
                                {localize("A5E.ItemRechargeThreshold")}
                            </label>

                            <input
                                id="{actionId}-recharge-formula"
                                class="small-input"
                                type="number"
                                value={action?.recharge?.threshold ?? 6}
                                on:change={({ target }) =>
                                    updateDocumentDataFromField(
                                        $item,
                                        `system.actions.${actionId}.recharge.threshold`,
                                        Number(target.value)
                                    )}
                            />
                        </div>
                    </div>
                {/if}
            </div>
        </FormSection>
    </section>
</section>

<style lang="scss">
    .row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        width: 100%;
    }
</style>
