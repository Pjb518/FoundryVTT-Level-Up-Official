<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import prepareAbilityOptions from "../../dataPreparationHelpers/prepareAbilityOptions";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import Checkbox from "../Checkbox.svelte";
    import FormSection from "../LegacyFormSection.svelte";
    import RadioGroup from "../RadioGroup.svelte";

    export let prompt;
    export let promptId;

    const item = getContext("item");
    const actionId = getContext("actionId");

    const skills = { ...CONFIG.A5E.skills };

    if (game.settings.get("a5e", "hideA5eSkills")) {
        delete skills.cul;
        delete skills.eng;
    }

    function updateAbility() {
        updateDocumentDataFromField(
            $item,
            `system.actions.${actionId}.prompts.${promptId}.ability`,
            selectedAbility,
        );
    }

    $: prompt = prompt;
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
    heading="A5E.Skill"
    --background="none"
    --direction="column"
    --padding="0"
>
    <select
        class="u-w-fit"
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.prompts.${promptId}.skill`,
                target.value,
            )}
    >
        {#each Object.entries(skills) as [skill, label]}
            <option value={skill} selected={prompt?.skill === skill}>
                {localize(label)}
            </option>
        {/each}
    </select>
</FormSection>

<FormSection
    heading="A5E.ItemAbilityCheckType"
    --background="none"
    --direction="column"
    --padding="0"
>
    <RadioGroup
        optionStyles="min-width: 2rem; text-align: center;"
        options={prepareAbilityOptions(false, true)}
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
            detail,
        );
    }}
/>
