<script lang="ts">
    import type { BaseActorA5e } from "../../../documents/actor/base";
    import type { ActionActivationOptions } from "../../../documents/item/data";
    import type { AttackRollData } from "../../../dataModels/item/actions/ActionRollsDataModel";
    import type { ItemA5e } from "../../../documents/item/item";
    import type { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import { RollPreparationManager } from "../../../managers/RollPreparationManager";

    import { getContext } from "svelte";

    import getRollFormula from "../../../utils/getRollFormula";

    import CheckboxGroup from "../CheckboxGroup.svelte";
    import ExpertiseDiePicker from "../ExpertiseDiePicker.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import RollModePicker from "../RollModePicker.svelte";

    export let attackRollData;
    export let options: ActionActivationOptions;
    export let attackRoll: AttackRollData;

    const actor: TJSDocument<BaseActorA5e> = getContext("actor");
    const dialog: any = getContext("dialog");
    const item: TJSDocument<ItemA5e> = getContext("item");

    function updateData() {
        attackRollData = {
            ...attackRoll,
            expertiseDie,
            rollMode,
            formula: rollFormula,
        };
    }

    let situationalMods = "";

    $: parts = RollPreparationManager.prepareAttackRollData(
        $actor,
        $item,
        attackRoll,
        options,
    );

    $: attackAbility = parts.attackAbility;
    $: attackBonuses = parts.attackBonuses;
    $: expertiseDie = parts.expertiseDie;
    $: expertiseDieSource = parts.expertiseDieSource;
    $: rollMode = parts.rollMode;
    $: rollModeSource = parts.rollModeSource;
    $: selectedAttackBonuses = parts.selectedAttackBonuses;

    $: rollFormula = getRollFormula($actor, {
        ability: attackAbility,
        attackBonus: attackRoll?.bonus,
        attackType: attackRoll.attackType,
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
    selected={rollMode.toString()}
    source={rollModeSource}
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
            attackBonus.label || attackBonus.defaultLabel || "",
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
