<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    export let consumer;
    export let consumerId;

    const item = getContext("item");
    const actionId = getContext("actionId");
    const A5E = CONFIG.A5E;

    function updateResourceSelection() {
        updateDocumentDataFromField(
            $item,
            `system.actions.${actionId}.consumers.${consumerId}.resource`,
            selectedResource
        );
    }

    let selectedResource = consumer.resource ?? "";
    $: selectedResource, updateResourceSelection();
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
            on:change={() =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.consumers.${consumerId}.label`
                )}
        />
    </div>

    <div class="a5e-field-group u-flex-row u-gap-md">
        <div class="u-flex u-flex-col u-gap-sm">
            <h3 class="a5e-field-group__heading">
                {localize("A5E.Resource")}
            </h3>

            <select
                name="{actionId}-{consumerId}-item-id"
                class="u-w-fit"
                bind:value={selectedResource}
            >
                <option value="" />

                {#each Object.entries(A5E.resourceConsumerConfig) as [value, { label }] (value)}
                    <option {value}>
                        {localize(label)}
                    </option>
                {/each}
            </select>
        </div>

        {#if A5E.resourceConsumerConfig?.[selectedResource]?.type === "value"}
            <div class="u-flex u-flex-col u-gap-sm u-w-30">
                <h3 class="a5e-field-group__heading">
                    {localize("A5E.ConsumeValue")}
                </h3>

                <input
                    type="number"
                    d-type="Number"
                    value={consumer.quantity ?? 1}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $item,
                            `system.actions.${actionId}.consumers.${consumerId}.quantity`,
                            Number(target.value)
                        )}
                />
            </div>
        {/if}
    </div>
</section>
