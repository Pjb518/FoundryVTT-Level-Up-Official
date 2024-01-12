<script>
    import { getContext } from "svelte";

    import Checkbox from "../Checkbox.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    const item = getContext("item");
    const actionId = getContext("actionId");

    export let deletePrompt;
    export let duplicatePrompt;
    export let prompt;
    export let promptId;
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

<FieldWrapper heading="A5E.RollFormula">
    <input
        id="{actionId}-{promptId}-roll-formula"
        type="text"
        value={prompt.formula ?? ""}
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.prompts.${promptId}.formula`,
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
