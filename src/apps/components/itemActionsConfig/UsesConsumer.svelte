<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    export let consumer;
    export let consumerId;

    const item = getContext("item");
    const actionId = getContext("actionId");
    const A5E = CONFIG.A5E;
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

    {#if consumer.type === "usesAction"}
        <div
            class="a5e-field-group a5e-field-group--formula u-flex-row u-gap-md"
        >
            <div class="u-flex u-flex-col u-gap-sm u-w-30">
                <h3 class="a5e-field-group__heading">
                    {localize("A5E.UsesCurrent")}
                </h3>

                <input
                    type="number"
                    d-type="Number"
                    value={consumer.value}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $item,
                            `system.actions.${actionId}.consumers.${consumerId}.value`,
                            Number(target.value)
                        )}
                />
            </div>

            <div class="u-flex u-flex-col u-gap-sm u-w-30">
                <h3 class="a5e-field-group__heading">
                    {localize("A5E.UsesMax")}
                </h3>

                <input
                    type="number"
                    d-type="Number"
                    value={consumer.max}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $item,
                            `system.actions.${actionId}.consumers.${consumerId}.max`,
                            Number(target.value)
                        )}
                />
            </div>

            <div class="u-flex u-flex-col u-gap-sm u-w-fit">
                <h3 class="a5e-field-group__heading">
                    {localize("A5E.UsesPer")}
                </h3>
                <select
                    class="u-w-40"
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $item,
                            `system.actions.${actionId}.consumers.${consumerId}.per`,
                            target.value
                        )}
                >
                    <option value="" />

                    {#each Object.entries(A5E.resourceRecoveryOptions) as [key, name]}
                        <option
                            {key}
                            value={key}
                            selected={consumer.per === key}
                        >
                            {localize(name)}
                        </option>
                    {/each}
                </select>
            </div>
        </div>
    {/if}
</section>
