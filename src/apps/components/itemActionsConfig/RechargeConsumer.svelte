<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    export let consumer;
    export let consumerId;

    const item = getContext("item");
    const actionId = getContext("actionId");

    const rechargeTypes = {
        item: "A5E.Item",
        action: "A5E.Action",
    };

    function updateType(value) {
        if (value === "item") {
            $item.update({
                [`system.actions.${actionId}.consumers.${consumerId}`]: {
                    consumeType: value,
                    [`-=formula`]: null,
                    [`-=threshold`]: null,
                },
            });
        }

        if (value === "action") {
            $item.update({
                [`system.actions.${actionId}.consumers.${consumerId}`]: {
                    consumeType: value,
                    formula: "1d6",
                    threshold: 6,
                },
            });
        }
    }

    console.log(consumer);
</script>

<section class="action-config__wrapper">
    <div class="a5e-field-group a5e-field-group--label">
        <label for="{actionId}-{consumerId}-label">
            {localize("A5E.Label")}
        </label>

        <input
            id="{actionId}-{consumerId}-label"
            name="{actionId}-{consumerId}-label"
            type="text"
            value={consumer.label ?? ""}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.consumers.${consumerId}.label`,
                    target.value
                )}
        />
    </div>

    <div class="a5e-field-group">
        <label for="{actionId}-recharge-type">
            {localize("A5E.ItemRechargeType")}
        </label>

        <select
            id="{actionId}-recharge-type"
            class="u-w-fit"
            on:change={({ target }) => updateType(target.value)}
        >
            {#each Object.entries(rechargeTypes) as [value, label]}
                <option
                    key={value}
                    value={value ?? "item"}
                    selected={consumer?.consumeType === value}
                >
                    {localize(label)}
                </option>
            {/each}
        </select>
    </div>

    {#if consumer.consumeType === "action"}
        <div class="row">
            <div class="a5e-field-group a5e-field-group--formula u-flex-grow">
                <label for="{actionId}-recharge-formula">
                    {localize("A5E.ItemRechargeFormula")}
                </label>

                <input
                    id="{actionId}-recharge-formula"
                    type="text"
                    value={consumer.formula ?? "1d6"}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $item,
                            `system.actions.${actionId}.consumers.${consumerId}.formula`,
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
                    value={consumer?.threshold ?? 6}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $item,
                            `system.actions.${actionId}.consumers.${consumerId}.threshold`,
                            Number(target.value)
                        )}
                />
            </div>
        </div>
    {/if}
</section>

<style lang="scss">
    .row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        width: 100%;
    }
</style>
