<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import computeSaveDC from "../../../utils/computeSaveDC";
    import prepareAbilityOptions from "../../dataPreparationHelpers/prepareAbilityOptions";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import Checkbox from "../Checkbox.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import RadioGroup from "../RadioGroup.svelte";
    import Section from "../Section.svelte";

    function updateAbility() {
        updateDocumentDataFromField(
            $item,
            `system.actions.${actionId}.prompts.${promptId}.ability`,
            selectedAbility,
        );
    }

    function selectSaveDCCalculationType(event) {
        const selectedOption = event.target?.selectedOptions[0]?.value;

        $item.update({
            [`system.actions.${actionId}.prompts.${promptId}.saveDC.type`]:
                selectedOption,
        });
    }

    function onSaveDCUpdate(actor) {
        try {
            const saveDC = computeSaveDC(actor, {
                type: prompt?.saveDC?.type,
                bonus: saveDCBonus,
            });

            saveDCIsValid = true;
            return saveDC;
        } catch {
            saveDCIsValid = false;
        }
    }

    export let deletePrompt;
    export let duplicatePrompt;
    export let prompt;
    export let promptId;

    const item = getContext("item");
    const actor = $item.actor && new TJSDocument($item.actor);
    const actionId = getContext("actionId");

    const { saveDCOptions } = CONFIG.A5E;

    let saveDCIsValid = true;
    let saveDCBonus = prompt?.saveDC?.bonus;

    $: saveDC = onSaveDCUpdate($actor, prompt?.saveDC?.type, saveDCBonus);

    $: selectedAbility = prompt.ability ?? "none";
    $: selectedAbility, updateAbility();
</script>

<FieldWrapper
    heading="A5E.Label"
    buttons={[
        {
            classes:
                "fa-solid fa-clone a5e-field-wrapper__header-button--scale",
            handler: () => duplicatePrompt(actionId, prompt),
        },
        {
            classes: "fas fa-trash a5e-field-wrapper__header-button--scale",
            handler: () => deletePrompt(actionId, promptId),
        },
    ]}
    --a5e-header-button-color="#bebdb5"
    --a5e-header-button-color-hover="#555"
    --a5e-field-wrapper-button-wrapper-gap="0.75rem"
>
    <input
        type="text"
        value={prompt.label ?? ""}
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.prompts.${promptId}.label`,
                target.value,
            )}
    />
</FieldWrapper>

<RadioGroup
    heading="A5E.ItemSavingThrowType"
    optionStyles="min-width: 2rem; text-align: center;"
    options={prepareAbilityOptions()}
    selected={selectedAbility}
    allowDeselect={false}
    on:updateSelection={({ detail }) => (selectedAbility = detail)}
/>

<Section
    --a5e-section-body-direction="row"
    --a5e-section-body-wrap="nowrap"
    --a5e-section-body-padding="0"
>
    <FieldWrapper
        heading="A5E.ItemSavingThrowDC"
        --a5e-field-wrapper-label-width="9rem"
    >
        <select on:change={selectSaveDCCalculationType}>
            {#each Object.entries(saveDCOptions) as [type, label]}
                <option value={type} selected={type === prompt?.saveDC?.type}>
                    {localize(label)}
                </option>
            {/each}
        </select>
    </FieldWrapper>

    <FieldWrapper
        heading={prompt?.saveDC?.type === "custom"
            ? "A5E.ItemSavingThrowDCCustom"
            : "A5E.ItemSavingThrowDCBonus"}
        --a5e-field-wrapper-grow="1"
    >
        <div class="u-flex u-gap-sm">
            <input
                type="text"
                autocomplete="off"
                bind:value={saveDCBonus}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        `system.actions.${actionId}.prompts.${promptId}.saveDC.bonus`,
                        target.value,
                    )}
            />

            {#if saveDC || !saveDCIsValid}
                <span
                    class="save-dc-preview"
                    class:save-dc-preview--invalid={!saveDCIsValid}
                    type="number"
                >
                    {#if saveDCIsValid}
                        {saveDC}
                    {:else}
                        <i class="fa-solid fa-circle-exclamation" />
                    {/if}
                </span>
            {/if}
        </div>
    </FieldWrapper>
</Section>

<FieldWrapper heading="A5E.ItemEffectOnSave">
    <input
        type="text"
        value={prompt.onSave ?? ""}
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.prompts.${promptId}.onSave`,
                target.value,
            )}
    />
</FieldWrapper>

<Checkbox
    label="A5E.PromptDefaultSelection"
    checked={prompt.default ?? true}
    on:updateSelection={({ detail }) => {
        updateDocumentDataFromField(
            $item,
            `system.actions.${actionId}.prompts.${promptId}.default`,
            detail,
        );
    }}
/>

<style lang="scss">
    .save-dc-preview {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 1.625rem;
        width: 3rem;
        border-radius: $border-radius-standard;
        background: rgba(0, 0, 0, 0.05);

        &--invalid {
            background: rgba(139, 37, 37, 0.25);
            border: 1px solid rgba(139, 37, 37, 0.25);
            color: rgba(139, 37, 37, 0.85);
            font-size: $font-size-md;
        }
    }
</style>
