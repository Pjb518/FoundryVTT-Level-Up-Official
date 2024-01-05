<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import prepareAbilityOptions from "../../dataPreparationHelpers/prepareAbilityOptions";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import Checkbox from "../Checkbox.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import RadioGroup from "../RadioGroup.svelte";

    function updateAbility() {
        updateDocumentDataFromField(
            $item,
            `system.actions.${actionId}.rolls.${rollId}.ability`,
            selectedAbility,
        );
    }

    export let deleteRoll;
    export let duplicateRoll;
    export let roll;
    export let rollId;

    const item = getContext("item");
    const actionId = getContext("actionId");

    const tools = Object.entries(CONFIG.A5E.tools)
        .map(([_, tools]) => Object.entries(tools))
        .flat()
        .sort((a, b) => a[0].toLowerCase().localeCompare(b[0].toLowerCase()));

    $: selectedAbility = roll.ability ?? "none";
    $: selectedAbility, updateAbility();
</script>

<FieldWrapper
    heading="A5E.Label"
    buttons={[
        {
            classes:
                "fa-solid fa-clone a5e-field-wrapper__header-button--scale",
            handler: () => duplicateRoll(actionId, roll),
        },
        {
            classes: "fas fa-trash a5e-field-wrapper__header-button--scale",
            handler: () => deleteRoll(actionId, rollId),
        },
    ]}
    --a5e-header-button-color="#bebdb5"
    --a5e-header-button-color-hover="#555"
    --a5e-field-wrapper-button-wrapper-gap="0.75rem"
>
    <input
        type="text"
        value={roll.label ?? ""}
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.rolls.${rollId}.label`,
                target.value,
            )}
    />
</FieldWrapper>

<FieldWrapper heading="A5E.Tool">
    <select
        class="u-w-fit"
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.rolls.${rollId}.tool`,
                target.value,
            )}
    >
        {#each tools as [tool, label]}
            <option value={tool} selected={roll?.tool === tool}>
                {localize(label)}
            </option>
        {/each}
    </select>
</FieldWrapper>

<RadioGroup
    heading="A5E.DefaultAbilityScore"
    optionStyles="min-width: 2rem; text-align: center;"
    options={prepareAbilityOptions(false, true)}
    selected={selectedAbility}
    allowDeselect={false}
    on:updateSelection={({ detail }) => (selectedAbility = detail)}
/>

<FieldWrapper heading="A5E.CheckBonus">
    <input
        type="text"
        value={roll.bonus ?? ""}
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.rolls.${rollId}.bonus`,
                target.value,
            )}
    />
</FieldWrapper>

<Checkbox
    label="A5E.ToolCheckDefaultSelection"
    checked={roll.default ?? true}
    on:updateSelection={({ detail }) => {
        updateDocumentDataFromField(
            $item,
            `system.actions.${actionId}.rolls.${rollId}.default`,
            detail,
        );
    }}
/>
