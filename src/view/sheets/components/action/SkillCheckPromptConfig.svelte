<script lang="ts">
    import type { PromptProps } from "./data.ts";

    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";
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

    const { skills } = CONFIG.A5E;

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

<FieldWrapper heading="A5E.skillLabels.title">
    <select
        class="a5e-input a5e-input--slim a5e-input--fit"
        onchange={({ currentTarget }) =>
            updateDocumentDataFromField(
                item,
                `system.actions.${actionId}.prompts.${promptId}.skill`,
                currentTarget.value,
            )}
    >
        {#each Object.entries(skills) as [skill, label]}
            <option value={skill} selected={prompt?.skill === skill}>
                {localize(label as string)}
            </option>
        {/each}
    </select>
</FieldWrapper>

<RadioGroup
    heading="A5E.items.headings.abilityCheckType"
    optionStyles="min-width: 2rem; text-align: center;"
    options={prepareAbilityOptions(false, true)}
    selected={selectedAbility}
    allowDeselect={false}
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
