<script>
    import { getContext } from "svelte";

    import getAttackAbility from "../../../utils/getAttackAbility";
    import getRollFormula from "../../../utils/getRollFormula";

    import CheckboxGroup from "../CheckboxGroup.svelte";
    import ExpertiseDiePicker from "../ExpertiseDiePicker.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import RollModePicker from "../RollModePicker.svelte";

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

    function updateData() {
        attackRollData = {
            ...attackRoll,
            expertiseDie,
            rollMode,
            formula: rollFormula,
        };
    }

    const attackAbility = getAttackAbility($actor, $item, attackRoll);

    let situationalMods = "";

    let expertiseDie = $actor.RollOverrideManager.getExpertiseDice(
        `attackTypes.${attackRoll?.attackType}`,
        options.expertiseDice ?? 0,
    );

    let expertiseDieSource = $actor.RollOverrideManager.getExpertiseDiceSource(
        `attackTypes.${attackRoll?.attackType}`,
        options.expertiseDice ?? 0,
    );

    let rollMode = $actor.RollOverrideManager.getRollOverride(
        `attackTypes.${attackRoll?.attackType}`,
        options.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL,
    );

    let rollModeString = $actor.RollOverrideManager.getRollOverridesSource(
        `attackTypes.${attackRoll?.attackType}`,
        rollMode,
    );

    $: selectedAttackBonuses = $actor.BonusesManager.getDefaultSelections("attacks", {
        item: $item,
        attackType: attackRoll?.attackType,
    });

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

<RollModePicker
    selected={rollMode}
    source={rollModeString}
    on:updateSelection={({ detail }) => (rollMode = detail)}
/>

<ExpertiseDiePicker
    --background="transparent"
    --padding="0"
    source={expertiseDieSource}
    selected={expertiseDie}
    type={$actor.type}
    on:updateSelection={({ detail }) => (expertiseDie = detail)}
/>

{#if Object.values(attackBonuses).flat().length}
    <CheckboxGroup
        heading="Attack Bonuses"
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
        font-size: var(--a5e-text-size-sm);
        border: 1px solid #7a7971;
        border-radius: 4px;
    }
</style>
