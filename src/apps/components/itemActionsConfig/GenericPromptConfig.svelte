<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import Checkbox from "../Checkbox.svelte";
    import FormSection from "../FormSection.svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    const item = getContext("item");
    const actionId = getContext("actionId");

    export let prompt;
    export let promptId;
</script>

<FormSection
    heading="A5E.Label"
    --background="transparent"
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
                target.value
            )}
    />
</FormSection>

<FormSection
    heading="A5E.RollFormula"
    --background="transparent"
    --direction="column"
    --padding="0"
>
    <input
        id="{actionId}-{promptId}-roll-formula"
        type="text"
        value={prompt.formula ?? ""}
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.prompts.${promptId}.formula`,
                target.value
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
            detail
        );
    }}
/>
