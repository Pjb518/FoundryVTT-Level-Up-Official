<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";
    import FieldWrapper from "../FieldWrapper.svelte";

    export let consumer;
    export let consumerId;
    export let deleteConsumer;

    const item = getContext("item");
    const actionId = getContext("actionId");
    const A5E = CONFIG.A5E;

    function updateMode() {
        updateDocumentDataFromField(
            $item,
            `system.actions.${actionId}.consumers.${consumerId}.mode`,
            mode,
        );
    }

    function updateSpellLevel() {
        updateDocumentDataFromField(
            $item,
            `system.actions.${actionId}.consumers.${consumerId}.spellLevel`,
            Number(spellLevel),
        );
    }

    let mode = consumer.mode ?? "variable";
    let spellLevel = consumer.spellLevel ?? 1;
    let hintToggle = false;
    $: mode, updateMode();
    $: spellLevel, updateSpellLevel();
</script>

<FieldWrapper
    heading="A5E.Label"
    buttons={[
        {
            classes: "fa-solid fa-trash",
            handler: () => deleteConsumer(actionId, consumerId),
        },
    ]}
    --a5e-header-button-color="rgba(0, 0, 0, 0.2)"
    --a5e-header-button-color-hover="#555"
>
    <input
        type="text"
        value={consumer.label ?? ""}
        on:change={() =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.consumers.${consumerId}.label`,
            )}
    />
</FieldWrapper>

<div class="a5e-field-group u-flex-row u-gap-md">
    <FieldWrapper heading="A5E.ConsumerSpellMode">
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
    </FieldWrapper>

    {#if ["variable", "slotsOnly"].includes(mode)}
        <FieldWrapper heading="A5E.SpellLevel">
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
        </FieldWrapper>
    {/if}

    {#if mode === "pointsOnly"}
        <FieldWrapper
            heading="A5E.SpellPoints"
            --a5e-field-wrapper-width="7.5rem"
        >
            <input
                type="number"
                d-type="Number"
                value={consumer.points ?? 1}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        `system.actions.${actionId}.consumers.${consumerId}.points`,
                        Number(target.value),
                    )}
            />
        </FieldWrapper>
    {/if}
</div>

<FieldWrapper
    heading="A5E.ConsumerSpellModeHintTitle"
    buttons={[
        {
            classes: `fa-solid ${hintToggle ? "fa-minus" : "fa-plus"}`,
            handler: () => (hintToggle = !hintToggle),
        },
    ]}
    --a5e-field-wrapper-header-item-justification="flex-start"
    --a5e-field-wrapper-header-gap="0.5rem"
>
    {#if hintToggle}
        <div class="a5e-box hint">
            <dt class="u-text-bold">Variable</dt>
            <dd class="u-m-0 u-p-0">
                Variable mode allows you to select from spell slots or spell
                points at casting time.
            </dd>

            <dt class="u-text-bold">Spell Points Only</dt>
            <dd class="u-m-0 u-p-0">
                Always consumes spells points, ignoring available spell slots.
            </dd>

            <dt class="u-text-bold">Spell Slots Only</dt>
            <dd class="u-m-0 u-p-0">
                Always consumes spell slots, ignoring available spell points.
            </dd>
        </div>
    {/if}
</FieldWrapper>

<style lang="scss">
    .hint {
        display: grid;
        grid-template-columns: max-content 1fr;

        column-gap: 0.75rem;
        row-gap: 0.25rem;
        font-size: $font-size-xs;
        padding: 0.5rem;
        margin-top: 0.25rem;
    }
</style>
