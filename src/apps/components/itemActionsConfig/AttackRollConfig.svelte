<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import prepareAbilityOptions from "../../dataPreparationHelpers/prepareAbilityOptions";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import Checkbox from "../Checkbox.svelte";
    import FormSection from "../LegacyFormSection.svelte";
    import RadioGroup from "../RadioGroup.svelte";

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

<FormSection
    heading="A5E.Label"
    --background="none"
    --direction="column"
    --padding="0"
    --margin="0 2.5rem 0 0"
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
</FormSection>

<RadioGroup
    heading="A5E.AbilityScore"
    hint="The ability score modifier to add to the attack roll."
    optionStyles="min-width: 2rem; text-align: center;"
    options={abilityOptions}
    selected={selectedAbility}
    on:updateSelection={({ detail }) => (selectedAbility = detail)}
/>

<FormSection --background="none" --padding="0">
    <FormSection
        heading="A5E.AttackType"
        --background="none"
        --direction="column"
        --grow="1"
        --padding="0"
    >
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
    </FormSection>

    <FormSection
        heading="A5E.AttackBonus"
        --background="none"
        --direction="column"
        --grow="1"
        --padding="0"
    >
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
    </FormSection>

    <FormSection
        heading="A5E.CriticalHitThreshold"
        --background="none"
        --direction="column"
        --padding="0"
        --grow="1"
    >
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
    </FormSection>
</FormSection>

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
