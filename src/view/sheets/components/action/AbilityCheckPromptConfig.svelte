<script lang="ts">
    import type { PromptProps } from "./data.ts";

    import { getContext } from "svelte";
    import { prepareAbilityOptions } from "#utils/view/helpers/prepareAbilityOptions.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";

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
    let actionId: string = getContext("actionId");

    const { abilities } = CONFIG.A5E;

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
    allowDeselect={false}
    heading="A5E.items.headings.abilityCheckType"
    optionStyles="min-width: 2rem; text-align: center;"
    options={prepareAbilityOptions()}
    selected={selectedAbility}
    onUpdateSelection={(value) => updateAbility(value)}
/>

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
