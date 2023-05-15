<script>
    import { getContext } from "svelte";

    import prepareAbilityOptions from "../../dataPreparationHelpers/prepareAbilityOptions";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import Checkbox from "../Checkbox.svelte";
    import FormSection from "../FormSection.svelte";
    import RadioGroup from "../RadioGroup.svelte";

    export let prompt;
    export let promptId;

    const item = getContext("item");
    const actionId = getContext("actionId");

    function updateAbility() {
        updateDocumentDataFromField(
            $item,
            `system.actions.${actionId}.prompts.${promptId}.ability`,
            selectedAbility
        );
    }

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
                target.value
            )}
    />
</FormSection>

<FormSection
    heading="A5E.ItemAbilityCheckType"
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
