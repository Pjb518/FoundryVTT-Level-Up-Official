<script lang="ts">
    import type { PromptProps } from "./data.ts";

    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";
    import { computeSaveDC } from "#utils/computeSaveDC.ts";
    import { prepareAbilityOptions } from "#utils/view/helpers/prepareAbilityOptions.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";
    import Section from "#view/snippets/Section.svelte";

    function getSaveDC() {
        try {
            const dc = computeSaveDC(actor.reactive, item.reactive, {
                type: prompt.saveDC?.type,
                bonus: saveDCBonus,
            });

            return { saveDCIsValid: true, saveDC: dc };
        } catch {
            saveDCIsValid = false;
            return { saveDCIsValid: false, saveDC: undefined };
        }
    }

    function selectSaveDCCalculationType(event: any) {
        const selectedOption = event.target?.selectedOptions[0]?.value;

        item.update({
            [`system.actions.${actionId}.prompts.${promptId}.saveDC.type`]:
                selectedOption,
        });
    }

    function updateAbility(ability: string) {
        selectedAbility = ability;
        updateDocumentDataFromField(
            item,
            `system.actions.${actionId}.prompts.${promptId}.ability`,
            selectedAbility,
        );
    }

    let { deletePrompt, duplicatePrompt, prompt, promptId }: PromptProps =
        $props();

    let item: any = getContext("item");
    let actor: any = item.actor;
    let actionId: string = getContext("actionId");

    const { saveDCOptions } = CONFIG.A5E;

    let saveDCBonus = $derived(prompt.saveDC?.bonus ?? 0);
    let { saveDCIsValid, saveDC } = $derived(getSaveDC());
    let selectedAbility = $derived(prompt.ability ?? "none");
</script>

<FieldWrapper
    heading="A5E.Label"
    buttons={[
        {
            classes:
                "icon fa-solid fa-clone a5e-field-wrapper__header-button--scale",
            handler: () => duplicatePrompt(actionId, prompt),
        },
        {
            classes:
                "icon fas fa-trash a5e-field-wrapper__header-button--scale",
            handler: () => deletePrompt(actionId, promptId),
        },
    ]}
    --a5e-field-wrapper-button-wrapper-gap="0.75rem"
>
    <input
        class="a5e-input a5e-input--slim"
        type="text"
        value={prompt.label ?? ""}
        onchange={({ currentTarget }) =>
            updateDocumentDataFromField(
                item,
                `system.actions.${actionId}.prompts.${promptId}.label`,
                currentTarget.value,
            )}
    />
</FieldWrapper>

<RadioGroup
    heading="A5E.actions.headings.savingThrows.type"
    optionStyles="min-width: 2rem; text-align: center;"
    options={prepareAbilityOptions()}
    selected={selectedAbility}
    allowDeselect={false}
    onUpdateSelection={(value) => updateAbility(value)}
/>

<Section
    --a5e-section-body-direction="row"
    --a5e-section-body-wrap="nowrap"
    --a5e-section-body-padding="0"
>
    <FieldWrapper
        heading="A5E.actions.headings.savingThrows.dc.title"
        --a5e-field-wrapper-label-width="9rem"
    >
        <select
            class="a5e-input a5e-input--slim a5e-input--fit"
            onchange={selectSaveDCCalculationType}
        >
            {#each Object.entries(saveDCOptions) as [type, label]}
                <option value={type} selected={type === prompt?.saveDC?.type}>
                    {localize(label as string)}
                </option>
            {/each}
        </select>
    </FieldWrapper>

    <FieldWrapper
        heading={prompt?.saveDC?.type === "custom"
            ? "A5E.actions.headings.savingThrows.dc.custom"
            : "A5E.actions.headings.savingThrows.dc.bonus"}
        --a5e-field-wrapper-grow="1"
    >
        <div class="a5e-action-config__flex-container">
            <input
                class="a5e-input a5e-input--slim"
                type="text"
                autocomplete="off"
                bind:value={saveDCBonus}
                onchange={({ currentTarget }) =>
                    updateDocumentDataFromField(
                        item,
                        `system.actions.${actionId}.prompts.${promptId}.saveDC.bonus`,
                        currentTarget.value,
                    )}
            />

            {#if saveDC || !saveDCIsValid}
                <span
                    class="a5e-save-dc-preview"
                    class:a5e-save-dc-preview--invalid={!saveDCIsValid}
                >
                    {#if saveDCIsValid}
                        {saveDC}
                    {:else}
                        <i class="icon fa-solid fa-circle-exclamation"></i>
                    {/if}
                </span>
            {/if}
        </div>
    </FieldWrapper>
</Section>

<FieldWrapper heading="A5E.actions.headings.savingThrows.onSave">
    <input
        class="a5e-input a5e-input--slim"
        type="text"
        value={prompt.onSave ?? ""}
        onchange={({ currentTarget }) =>
            updateDocumentDataFromField(
                item,
                `system.actions.${actionId}.prompts.${promptId}.onSave`,
                currentTarget.value,
            )}
    />
</FieldWrapper>

<Checkbox
    label="A5E.PromptDefaultSelection"
    checked={prompt.default ?? true}
    onUpdateSelection={(value) => {
        updateDocumentDataFromField(
            item,
            `system.actions.${actionId}.prompts.${promptId}.default`,
            value,
        );
    }}
/>

<style lang="scss">
    .a5e-save-dc-preview {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 27px;
        width: 3rem;
        border-radius: var(--a5e-border-radius-standard);
        background: rgba(0, 0, 0, 0.05);

        &--invalid {
            background: rgba(139, 37, 37, 0.25);
            border: 1px solid rgba(139, 37, 37, 0.25);
            color: rgba(139, 37, 37, 0.85);
            font-size: var(--a5e-text-size-md);
        }
    }
</style>
