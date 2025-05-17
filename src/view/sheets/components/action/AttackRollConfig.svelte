<script lang="ts">
    import type { RollProps } from "./data.ts";

    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import { prepareAbilityOptions } from "#utils/view/helpers/prepareAbilityOptions.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";
    import Section from "#view/snippets/Section.svelte";

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

    const { A5E } = CONFIG;
    const abilityOptions = [
        ["none", "A5E.None"],
        ["default", "A5E.abilities.default"],
        ["spellcasting", "A5E.abilities.spellcasting"],
        ...prepareAbilityOptions(),
    ];

    let selectedAbility = $derived(roll.ability ?? "none");
</script>

<FieldWrapper
    heading="A5E.Label"
    buttons={[
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
        value={roll.label ?? ""}
        onchange={({ currentTarget }) =>
            updateDocumentDataFromField(
                item,
                `system.actions.${actionId}.rolls.${rollId}.label`,
                currentTarget.value,
            )}
    />
</FieldWrapper>

<RadioGroup
    heading="A5E.abilities.headings.score"
    hint="The ability score modifier to add to the attack roll."
    optionStyles="min-width: 2rem; text-align: center;"
    options={abilityOptions}
    selected={selectedAbility}
    onUpdateSelection={(value) => updateAbility(value)}
/>

<Section
    --a5e-section-body-direction="row"
    --a5e-section-body-padding="0"
    --a5e-section-body-wrap="nowrap"
>
    <FieldWrapper heading="A5E.attacks.headings.type">
        <select
            class="a5e-input a5e-input--slim a5e-input--fit"
            onchange={({ currentTarget }) =>
                updateDocumentDataFromField(
                    item,
                    `system.actions.${actionId}.rolls.${rollId}.attackType`,
                    currentTarget.value,
                )}
        >
            {#each Object.entries(A5E.attackTypes) as [key, name] (key)}
                <option value={key} selected={roll.attackType === key}>
                    {localize(name as string)}
                </option>
            {/each}
        </select>
    </FieldWrapper>

    <FieldWrapper
        heading="A5E.attacks.headings.bonus"
        --a5e-field-wrapper-grow="1"
    >
        <input
            class="a5e-input a5e-input--slim"
            type="text"
            value={roll.bonus || "0"}
            onchange={({ currentTarget }) =>
                updateDocumentDataFromField(
                    item,
                    `system.actions.${actionId}.rolls.${rollId}.bonus`,
                    currentTarget.value,
                )}
        />
    </FieldWrapper>

    <FieldWrapper heading="A5E.CriticalHitThreshold">
        <input
            class="a5e-input a5e-input--slim"
            type="number"
            value={roll.critThreshold ?? 20}
            onchange={({ currentTarget }) =>
                updateDocumentDataFromField(
                    item,
                    `system.actions.${actionId}.rolls.${rollId}.critThreshold`,
                    Number(currentTarget.value),
                )}
        />
    </FieldWrapper>
</Section>

<Checkbox
    label="A5E.bonuses.labels.proficiency.addButton"
    checked={roll.proficient ?? true}
    onUpdateSelection={(value) => {
        updateDocumentDataFromField(
            item,
            `system.actions.${actionId}.rolls.${rollId}.proficient`,
            value,
        );
    }}
/>
