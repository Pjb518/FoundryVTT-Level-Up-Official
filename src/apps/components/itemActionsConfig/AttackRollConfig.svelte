<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import prepareAbilityOptions from "../../dataPreparationHelpers/prepareAbilityOptions";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import Checkbox from "../Checkbox.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import RadioGroup from "../RadioGroup.svelte";
    import Section from "../Section.svelte";

    export let deleteRoll;
    export let duplicateRoll;
    export let roll;
    export let rollId;

    const item = getContext("item");
    const actionId = getContext("actionId");

    function updateAbility() {
        updateDocumentDataFromField(
            $item,
            `system.actions.${actionId}.rolls.${rollId}.ability`,
            selectedAbility,
        );
    }

    const A5E = CONFIG.A5E;
    const abilityOptions = [
        ["none", "A5E.None"],
        ["default", "A5E.abilities.default"],
        ["spellcasting", "A5E.abilities.spellcasting"],
        ...prepareAbilityOptions(),
    ];

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
    heading="A5E.AbilityScore"
    hint="The ability score modifier to add to the attack roll."
    optionStyles="min-width: 2rem; text-align: center;"
    options={abilityOptions}
    selected={selectedAbility}
    on:updateSelection={({ detail }) => (selectedAbility = detail)}
/>

<Section
    --a5e-section-body-direction="row"
    --a5e-section-body-padding="0"
    --a5e-section-body-wrap="nowrap"
>
    <FieldWrapper heading="A5E.AttackType">
        <select
            class="u-w-full"
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.rolls.${rollId}.attackType`,
                    target.value,
                )}
        >
            {#each Object.entries(A5E.attackTypes) as [key, name] (key)}
                <option value={key} selected={roll.attackType === key}>
                    {localize(name)}
                </option>
            {/each}
        </select>
    </FieldWrapper>

    <FieldWrapper heading="A5E.AttackBonus" --a5e-field-wrapper-grow="1">
        <input
            type="text"
            value={roll.bonus ?? 0}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.rolls.${rollId}.bonus`,
                    target.value,
                )}
        />
    </FieldWrapper>

    <FieldWrapper heading="A5E.CriticalHitThreshold">
        <input
            type="number"
            value={roll.critThreshold ?? 20}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.rolls.${rollId}.critThreshold`,
                    Number(target.value),
                )}
        />
    </FieldWrapper>
</Section>

<Checkbox
    label="A5E.AddProficiency"
    checked={roll.proficient ?? true}
    on:updateSelection={({ detail }) => {
        updateDocumentDataFromField(
            $item,
            `system.actions.${actionId}.rolls.${rollId}.proficient`,
            detail,
        );
    }}
/>
