<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import handleDeterministicInput from "../../utils/handleDeterministicInput";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    export let consumer;
    export let consumerId;

    const item = getContext("item");
    const actionId = getContext("actionId");

    const options = {
        item: "A5E.Item",
        action: "A5E.Action",
        both: "A5E.Both",
    };

    function updateSelection() {
        updateDocumentDataFromField(
            $item,
            `system.actions.${actionId}.consumers.${consumerId}.consumeType`,
            selectedType
        );
    }

    let selectedType = consumer.consumeType;
    $: selectedType, updateSelection();
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

    <div class="a5e-field-group u-flex-row u-gap-lg">
        <div class="u-flex u-flex-col u-gap-sm">
            <h3 class="a5e-field-group__heading">
                {localize("A5E.ItemType")}
            </h3>

            <select
                id="{actionId}-{consumerId}-item-id"
                class="u-w-fit"
                bind:value={selectedType}
            >
                <option value="" />
                {#each Object.entries(options) as [type, label]}
                    <option value={type}>
                        {label}
                    </option>
                {/each}
            </select>
        </div>

        <div class="u-flex u-flex-col u-gap-sm u-w-30">
            <h3 class="a5e-field-group__heading">
                {localize("A5E.ItemDefaultQuantity")}
            </h3>
            <input
                type="number"
                d-type="Number"
                value={consumer.default ?? 1}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        `system.actions.${actionId}.consumers.${consumerId}.default`,
                        Number(target.value)
                    )}
            />
        </div>
    </div>
</section>
