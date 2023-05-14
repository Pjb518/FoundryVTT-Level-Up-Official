<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import prepareAbilityOptions from "../../dataPreparationHelpers/prepareAbilityOptions";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import Checkbox from "../Checkbox.svelte";
    import RadioGroup from "../RadioGroup.svelte";

    export let prompt;
    export let promptId;

    const item = getContext("item");
    const actionId = getContext("actionId");

    const { skills } = CONFIG.A5E;

    function updateAbility() {
        updateDocumentDataFromField(
            $item,
            `system.actions.${actionId}.prompts.${promptId}.ability`,
            selectedAbility
        );
    }

    $: prompt = prompt;
    $: selectedAbility = prompt.ability ?? "none";
    $: selectedAbility, updateAbility();
</script>

<div class="a5e-field-group a5e-field-group--label">
    <label for="{actionId}-{promptId}-label">
        {localize("A5E.Label")}
    </label>

    <input
        id="{actionId}-{promptId}-label"
        type="text"
        value={prompt.label ?? ""}
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.prompts.${promptId}.label`,
                target.value
            )}
    />
</div>

<div class="option-wrapper">
    <h3 class="a5e-field-group__heading">
        {localize("A5E.Skill")}
    </h3>

    <select
        class="u-w-fit"
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.prompts.${promptId}.skill`,
                target.value
            )}
    >
        {#each Object.entries(skills) as [skill, label]}
            <option value={skill} selected={prompt?.skill === skill}>
                {localize(label)}
            </option>
        {/each}
    </select>
</div>

<div class="a5e-field-group">
    <h3 class="a5e-field-group__heading">
        {localize("A5E.ItemAbilityCheckType")}
    </h3>

    <RadioGroup
        optionStyles="min-width: 2rem; text-align: center;"
        options={prepareAbilityOptions(false, true)}
        selected={selectedAbility}
        allowDeselect={false}
        on:updateSelection={({ detail }) => (selectedAbility = detail)}
    />
</div>

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

<style lang="scss">
    .option-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        font-size: 0.694rem;
        font-family: "Signika", sans-serif;
    }
</style>
