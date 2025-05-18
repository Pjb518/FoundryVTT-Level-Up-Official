<script lang="ts">
    import type { PromptProps } from "./data.ts";

    import { getContext } from "svelte";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";

    let { deletePrompt, duplicatePrompt, prompt, promptId }: PromptProps =
        $props();

    let item: any = getContext("item");
    let actionId: string = getContext("actionId");
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

<FieldWrapper heading="A5E.rollLabels.rollFormula">
    <input
        class="a5e-input a5e-input--slim"
        id="{actionId}-{promptId}-roll-formula"
        type="text"
        value={prompt.formula ?? ""}
        onchange={({ currentTarget }) =>
            updateDocumentDataFromField(
                item,
                `system.actions.${actionId}.prompts.${promptId}.formula`,
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
