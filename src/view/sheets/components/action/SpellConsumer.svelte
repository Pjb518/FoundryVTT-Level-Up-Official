<script lang="ts">
    import type { ConsumerProps } from "./data.ts";

    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";

    function updateMode(value: string) {
        updateDocumentDataFromField(
            item,
            `system.actions.${actionId}.consumers.${consumerId}.mode`,
            value,
        );
    }

    function updateSpellLevel(value: string) {
        updateDocumentDataFromField(
            item,
            `system.actions.${actionId}.consumers.${consumerId}.spellLevel`,
            Number(value),
        );
    }

    let { consumer, consumerId, deleteConsumer }: ConsumerProps = $props();
    const { A5E } = CONFIG;

    const item: any = getContext("item");
    const actionId: string = getContext("actionId");

    let mode: string = $derived(consumer.mode ?? "variable");
    let spellLevel: number = $derived(consumer.spellLevel ?? 1);
    let hintToggle = $state(false);
</script>

<FieldWrapper
    heading="A5E.Label"
    buttons={[
        {
            classes: "icon fa-solid fa-trash",
            handler: () => deleteConsumer(actionId, consumerId),
        },
    ]}
>
    <input
        class="a5e-input a5e-input--slim"
        type="text"
        value={consumer.label ?? ""}
        onchange={({ currentTarget }) =>
            updateDocumentDataFromField(
                item,
                `system.actions.${actionId}.consumers.${consumerId}.label`,
                currentTarget.value,
            )}
    />
</FieldWrapper>

<div class="a5e-action-config__flex-container">
    <FieldWrapper heading="A5E.consumers.spellMode">
        <select
            class="a5e-input a5e-input--slim a5e-input--fit"
            name="{actionId}-{consumerId}-item-id"
            value={mode}
            onchange={({ currentTarget }) => updateMode(currentTarget.value)}
        >
            {#each Object.entries(A5E.spellConsumerModes) as [value, label]}
                <option {value} selected={mode === value}>
                    {localize(label as string)}
                </option>
            {/each}
        </select>
    </FieldWrapper>

    {#if ["variable", "slotsOnly"].includes(mode)}
        <FieldWrapper heading="A5E.spells.level">
            <select
                class="a5e-input a5e-input--slim a5e-input--fit"
                name="{actionId}-{consumerId}-item-id"
                value={spellLevel}
                onchange={({ currentTarget }) =>
                    updateSpellLevel(currentTarget.value)}
            >
                {#each Object.entries(A5E.spellLevels).slice(1) as [value, label]}
                    <option value={Number(value)}>
                        {localize(label as string)}
                    </option>
                {/each}
            </select>
        </FieldWrapper>
    {/if}

    {#if mode === "chargesOnly"}
        <FieldWrapper
            heading="A5E.spells.spellcasting.artifactCharges"
            --a5e-field-wrapper-width="7.5rem"
        >
            <input
                class="a5e-input a5e-input--slim a5e-input--small"
                type="number"
                value={consumer.charges ?? 1}
                onchange={({ currentTarget }) =>
                    updateDocumentDataFromField(
                        item,
                        `system.actions.${actionId}.consumers.${consumerId}.charges`,
                        Number(currentTarget.value),
                    )}
            />
        </FieldWrapper>
    {/if}

    {#if mode === "inventionsOnly"}
        <FieldWrapper
            heading="A5E.spells.spellcasting.inventions"
            --a5e-field-wrapper-width="7.5rem"
        >
            <input
                class="a5e-input a5e-input--slim a5e-input--small"
                type="number"
                value={consumer.inventions ?? 1}
                onchange={({ currentTarget }) =>
                    updateDocumentDataFromField(
                        item,
                        `system.actions.${actionId}.consumers.${consumerId}.inventions`,
                        Number(currentTarget.value),
                    )}
            />
        </FieldWrapper>
    {/if}

    {#if mode === "pointsOnly"}
        <FieldWrapper
            heading="A5E.spells.spellcasting.points"
            --a5e-field-wrapper-width="7.5rem"
        >
            <input
                class="a5e-input a5e-input--slim a5e-input--small"
                type="number"
                value={consumer.points ?? 1}
                onchange={({ currentTarget }) =>
                    updateDocumentDataFromField(
                        item,
                        `system.actions.${actionId}.consumers.${consumerId}.points`,
                        Number(currentTarget.value),
                    )}
            />
        </FieldWrapper>
    {/if}
</div>

<FieldWrapper
    heading="A5E.consumers.spellModeHintTitle"
    buttons={[
        {
            classes: `icon fa-solid ${hintToggle ? "fa-minus" : "fa-plus"}`,
            handler: () => (hintToggle = !hintToggle),
        },
    ]}
    --a5e-field-wrapper-header-item-justification="flex-start"
    --a5e-field-wrapper-header-gap="0.5rem"
>
    {#if hintToggle}
        <div class="a5e-dl-box hint">
            <dt class="a5e-dl-box__header">Variable</dt>
            <dd class="a5e-dl-box__content">
                Variable mode allows you to select from spell slots or spell
                points at casting time.
            </dd>

            <dt class="a5e-dl-box__header">Spell Points Only</dt>
            <dd class="a5e-dl-box__content">
                Always consumes spells points, ignoring available spell slots.
            </dd>

            <dt class="a5e-dl-box__header">Spell Slots Only</dt>
            <dd class="a5e-dl-box__content">
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
        font-size: var(--a5e-xs-text);
        padding: 0.5rem;
        margin-top: 0.25rem;
    }
</style>
