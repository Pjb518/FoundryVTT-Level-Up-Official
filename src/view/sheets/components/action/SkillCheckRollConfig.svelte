<script lang="ts">
    import type { RollProps } from "./data.ts";

    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";
    import { prepareAbilityOptions } from "#utils/view/helpers/prepareAbilityOptions.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";

    function updateAbility(ability: string) {
        selectedAbility = ability;
        updateDocumentDataFromField(
            item,
            `system.actions.${actionId}.rolls.${rollId}.ability`,
            selectedAbility,
        );
    }

    let { deleteRoll, duplicateRoll, roll, rollId }: RollProps = $props();

    let item: any = getContext("item");
    let actionId: string = getContext("actionId");

    const { skills } = CONFIG.A5E;

    let selectedAbility = $derived(roll.ability ?? "none");
</script>

<FieldWrapper
    heading="A5E.Label"
    buttons={[
        {
            classes:
                "icon fa-solid fa-clone a5e-field-wrapper__header-button--scale",
            handler: () => duplicateRoll(actionId, roll),
        },
        {
            classes:
                "icon fas fa-trash a5e-field-wrapper__header-button--scale",
            handler: () => deleteRoll(actionId, rollId),
        },
    ]}
    --a5e-field-wrapper-button-wrapper-gap="0.75rem"
>
    <input
        class="a5e-input a5e-input--slim"
        type="text"
        value={roll?.label ?? ""}
        onchange={({ currentTarget }) =>
            updateDocumentDataFromField(
                item,
                `system.actions.${actionId}.rolls.${rollId}.label`,
                currentTarget.value,
            )}
    />
</FieldWrapper>

<FieldWrapper heading="A5E.skillLabels.title">
    <select
        class="a5e-input a5e-input--slim a5e-input--fit"
        onchange={({ currentTarget }) =>
            updateDocumentDataFromField(
                item,
                `system.actions.${actionId}.rolls.${rollId}.skill`,
                currentTarget.value,
            )}
    >
        {#each Object.entries(skills) as [skill, label]}
            <option value={skill} selected={roll?.skill === skill}>
                {localize(label as string)}
            </option>
        {/each}
    </select>
</FieldWrapper>

<RadioGroup
    allowDeselect={false}
    heading="A5E.abilities.headings.default"
    optionStyles="min-width: 2rem; text-align: center;"
    options={prepareAbilityOptions(false, true)}
    selected={selectedAbility}
    onUpdateSelection={(value) => updateAbility(value)}
/>

<FieldWrapper heading="A5E.bonuses.labels.checkBonus">
    <input
        class="a5e-input a5e-input--slim"
        type="text"
        value={roll.bonus ?? ""}
        onchange={({ currentTarget }) =>
            updateDocumentDataFromField(
                item,
                `system.actions.${actionId}.rolls.${rollId}.bonus`,
                currentTarget.value,
            )}
    />
</FieldWrapper>

<Checkbox
    label="A5E.skillLabels.checks.defaultSelection"
    checked={roll.default ?? true}
    onUpdateSelection={(value) => {
        updateDocumentDataFromField(
            item,
            `system.actions.${actionId}.rolls.${rollId}.default`,
            value,
        );
    }}
/>
