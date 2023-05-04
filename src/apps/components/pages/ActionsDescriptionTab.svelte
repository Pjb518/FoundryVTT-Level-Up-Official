<script>
    import { getContext } from "svelte";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import CheckboxGroup from "../CheckboxGroup.svelte";
    import Editor from "../Editor.svelte";
    import FormSection from "../FormSection.svelte";

    const item = getContext("item");
    const actionId = getContext("actionId");

    const descriptionOutputOptions = [
        ["action", "A5E.ActionActivationAction"],
        ["item", "A5E.Item"],
    ];

    $: content = $item.system.actions[actionId]?.description;
    $: descriptionOutputs = $item.system.actions[actionId]
        ?.descriptionOutputs ?? ["item"];
</script>

<section>
    <FormSection
        heading="A5E.ActionDescriptionOptions"
        hint="A5E.ActionDescriptionOptionsHint"
    >
        <CheckboxGroup
            options={descriptionOutputOptions}
            selected={descriptionOutputs}
            on:updateSelection={({ detail }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.descriptionOutputs`,
                    detail
                )}
        />
    </FormSection>

    <Editor
        document={item}
        {content}
        updatePath={`system.actions.${actionId}.description`}
    />
</section>

<style>
    section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        height: 100%;
    }
</style>
