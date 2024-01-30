<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import getAttackAbility from "../../../utils/getAttackAbility";
    import getRollFormula from "../../../utils/getRollFormula";
    import overrideRollMode from "../../../utils/overrideRollMode";
    import overrideExpertiseDie from "../../../utils/overrideExpertiseDie";

    import CheckboxGroup from "../CheckboxGroup.svelte";
    import ExpertiseDiePicker from "../ExpertiseDiePicker.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import RadioGroup from "../RadioGroup.svelte";

    export let attackRollData;
    export let options;
    export let attackRoll;

    const actor = getContext("actor");
    const dialog = getContext("dialog");
    const item = getContext("item");
    const attackBonuses = $actor.BonusesManager.prepareAttackBonuses(
        $item,
        attackRoll?.attackType,
    );
    console.log(attackBonuses);

    function updateData() {
        attackRollData = {
            ...attackRoll,
            expertiseDie,
            rollMode,
            formula: rollFormula,
        };
    }

    const attackAbility = getAttackAbility($actor, $item, attackRoll);

    const rollModeOptions = Object.entries(CONFIG.A5E.rollModes).map(
        ([key, value]) => [
            CONFIG.A5E.ROLL_MODE[key.toUpperCase()],
            localize(value),
        ],
    );

    let expertiseDie = overrideExpertiseDie($actor, 0);
    let situationalMods = "";

    let rollMode = overrideRollMode(
        $actor,
        options.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL,
        {
            attackType: attackRoll.attackType,
            type: "attack",
        },
    );

    $: selectedAttackBonuses = $actor.BonusesManager.getDefaultSelections(
        "attacks",
        { item: $item, attackType: attackRoll?.attackType },
    );

    $: rollFormula = getRollFormula($actor, {
        ability: attackAbility,
        attackBonus: attackRoll?.bonus,
        attackType: attackRoll?.attackType,
        expertiseDie,
        item: $item,
        proficient: attackRoll?.proficient ?? true,
        situationalMods,
        rollMode,
        selectedAttackBonuses,
        type: "attack",
    });

    $: rollFormula, updateData();

    updateData();
</script>

<RadioGroup
    heading="A5E.AttackRollModeHeading"
    options={rollModeOptions}
    selected={rollMode}
    on:updateSelection={({ detail }) => (rollMode = detail)}
/>

<ExpertiseDiePicker
    --background="transparent"
    --padding="0"
    selected={expertiseDie}
    type={$actor.type}
    on:updateSelection={({ detail }) => (expertiseDie = detail)}
/>

{#if Object.values(attackBonuses).flat().length}
    <CheckboxGroup
        heading="Ability Bonuses"
        options={attackBonuses.map(([key, attackBonus]) => [
            key,
            attackBonus.label || attackBonus.defaultLabel,
        ])}
        selected={selectedAttackBonuses}
        on:updateSelection={({ detail }) => (selectedAttackBonuses = detail)}
    />
{/if}

<FieldWrapper
    heading="A5E.SituationalMods"
    --background="transparent"
    --gap="0.25rem"
    --padding="0"
>
    <input
        class="a5e-input"
        type="text"
        id="{$actor.id}-{dialog.id}-situational-mod"
        bind:value={situationalMods}
    />
</FieldWrapper>

<section class="roll-formula-preview">
    {rollFormula}
</section>

<style lang="scss">
    .roll-formula-preview {
        padding: 0.5rem;
        font-size: $font-size-sm;
        border: 1px solid #7a7971;
        border-radius: 4px;
    }
</style>
