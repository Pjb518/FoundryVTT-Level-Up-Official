<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import prepareAbilityOptions from "../../dataPreparationHelpers/prepareAbilityOptions";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import Checkbox from "../Checkbox.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import RadioGroup from "../RadioGroup.svelte";

    function deletePrompt() {
        $item.update({
            [`system.actions.${actionId}.prompts`]: {
                [`-=${promptId}`]: null,
            },
        });
    }

    function duplicatePrompt() {
        const newPrompt = foundry.utils.duplicate(prompt);

        $item.update({
            [`system.actions.${actionId}.prompts`]: {
                [foundry.utils.randomID()]: newPrompt,
            },
        });
    }

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

<FieldWrapper
    heading="A5E.Label"
    buttons={[
        {
            classes:
                "fa-solid fa-clone a5e-field-wrapper__header-button--scale",
            handler: duplicatePrompt,
        },
        {
            classes: "fas fa-trash a5e-field-wrapper__header-button--scale",
            handler: deletePrompt,
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

<FieldWrapper heading="A5E.Skill">
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
</FieldWrapper>

<RadioGroup
    heading="A5E.ItemAbilityCheckType"
    optionStyles="min-width: 2rem; text-align: center;"
    options={prepareAbilityOptions(false, true)}
    selected={selectedAbility}
    allowDeselect={false}
    on:updateSelection={({ detail }) => (selectedAbility = detail)}
/>

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
