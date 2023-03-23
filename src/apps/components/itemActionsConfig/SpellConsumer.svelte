<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    export let consumer;
    export let consumerId;

    const item = getContext("item");
    const actionId = getContext("actionId");
    const A5E = CONFIG.A5E;

    function updateMode() {
        updateDocumentDataFromField(
            $item,
            `system.actions.${actionId}.consumers.${consumerId}.mode`,
            mode
        );
    }

    function updateSpellLevel() {
        updateDocumentDataFromField(
            $item,
            `system.actions.${actionId}.consumers.${consumerId}.spellLevel`,
            Number(spellLevel)
        );
    }

    let mode = consumer.mode ?? "both";
    let spellLevel = consumer.spellLevel ?? 1;
    $: mode, updateMode();
    $: spellLevel, updateSpellLevel();
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
                {localize("A5E.ConsumerSpellMode")}
            </h3>

            <select
                name="{actionId}-{consumerId}-item-id"
                class="u-w-fit"
                bind:value={mode}
            >
                {#each Object.entries(A5E.spellConsumerModes) as [value, label]}
                    <option {value} selected={mode === value}>
                        {localize(label)}
                    </option>
                {/each}
            </select>
        </div>

        {#if ["both", "slotsOnly"].includes(mode)}
            <div class="u-flex u-flex-col u-gap-sm">
                <h3 class="a5e-field-group__heading">
                    {localize("A5E.SpellLevel")}
                </h3>

                <select
                    name="{actionId}-{consumerId}-item-id"
                    class="u-w-fit"
                    bind:value={spellLevel}
                >
                    {#each Object.entries(A5E.spellLevels).slice(1) as [value, label]}
                        <option value={Number(value)}>
                            {localize(label)}
                        </option>
                    {/each}
                </select>
            </div>
        {/if}

        {#if mode === "pointsOnly"}
            <div class="u-flex u-flex-col u-gap-sm u-w-30">
                <h3 class="a5e-field-group__heading">
                    {localize("A5E.SpellPoints")}
                </h3>

                <input
                    type="number"
                    d-type="Number"
                    value={consumer.points ?? 1}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $item,
                            `system.actions.${actionId}.consumers.${consumerId}.points`,
                            Number(target.value)
                        )}
                />
            </div>
        {/if}
    </div>
</section>
