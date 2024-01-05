<script>
    import { getContext } from "svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import Checkbox from "../Checkbox.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import RadioGroup from "../RadioGroup.svelte";

    export let deleteRoll;
    export let duplicateRoll;
    export let roll;
    export let rollId;

    const item = getContext("item");
    const actionId = getContext("actionId");
    const { abilities } = CONFIG.A5E;

    function updateAbility() {
        updateDocumentDataFromField(
            $item,
            `system.actions.${actionId}.rolls.${rollId}.ability`,
            selectedAbility,
        );
    }

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

<RadioGroup
    heading="A5E.ItemAbilityCheckType"
    optionStyles="min-width: 2rem; text-align: center;"
    options={Object.entries(abilities)}
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
    label="A5E.AbilityCheckDefaultSelection"
    checked={roll.default ?? true}
    on:updateSelection={({ detail }) => {
        updateDocumentDataFromField(
            $item,
            `system.actions.${actionId}.rolls.${rollId}.default`,
            detail,
        );
    }}
/>
