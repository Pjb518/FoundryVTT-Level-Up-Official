<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import computeSaveDC from "../../../utils/computeSaveDC";
    import prepareAbilityOptions from "../../dataPreparationHelpers/prepareAbilityOptions";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import Checkbox from "../Checkbox.svelte";
    import FormSection from "../LegacyFormSection.svelte";
    import RadioGroup from "../RadioGroup.svelte";

    export let prompt;
    export let promptId;

    const item = getContext("item");
    const actor = $item.actor && new TJSDocument($item.actor);
    const actionId = getContext("actionId");

    const { saveDCOptions } = CONFIG.A5E;

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

    let saveDCIsValid = true;
    let saveDCBonus = prompt?.saveDC?.bonus;

    $: saveDC = onSaveDCUpdate($actor, prompt?.saveDC?.type, saveDCBonus);

    $: selectedAbility = prompt.ability ?? "none";
    $: selectedAbility, updateAbility();
</script>

<FormSection
    heading="A5E.Label"
    --background="none"
    --direction="column"
    --grow="1"
    --padding="0"
    --margin="0 4.5rem 0 0"
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
</FormSection>

<FormSection
    heading="A5E.ItemSavingThrowType"
    --background="none"
    --direction="column"
    --padding="0"
>
    <RadioGroup
        optionStyles="min-width: 2rem; text-align: center;"
        options={prepareAbilityOptions()}
        selected={selectedAbility}
        allowDeselect={false}
        on:updateSelection={({ detail }) => (selectedAbility = detail)}
    />
</FormSection>

<FormSection --background="none" --padding="0">
    <FormSection
        heading="A5E.ItemSavingThrowDC"
        --background="none"
        --direction="column"
        --label-width="9rem"
        --padding="0"
    >
        <select on:change={selectSaveDCCalculationType}>
            {#each Object.entries(saveDCOptions) as [type, label]}
                <option value={type} selected={type === prompt?.saveDC?.type}>
                    {localize(label)}
                </option>
            {/each}
        </select>
    </FormSection>

    <FormSection
        heading={prompt?.saveDC?.type === "custom"
            ? "A5E.ItemSavingThrowDCCustom"
            : "A5E.ItemSavingThrowDCBonus"}
        --background="none"
        --direction="column"
        --grow="1"
        --padding="0"
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
    </FormSection>
</FormSection>

<FormSection
    heading="A5E.ItemEffectOnSave"
    --background="none"
    --direction="column"
    --padding="0"
>
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
</FormSection>

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
