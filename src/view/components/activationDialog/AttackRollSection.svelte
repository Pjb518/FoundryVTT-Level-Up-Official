<script lang="ts">
    import type { ActionActivationOptions } from "../../../documents/item/data.ts";
    import type { AttackRollData } from "../../../dataModels/item/actions/ActionRollsDataModel.ts";

    import { getContext } from "svelte";

    import { RollPreparationManager } from "#managers/RollPreparationManager.ts";

    import getRollFormula from "#utils/getRollFormula.js";

    import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";
    import ExpertiseDiePicker from "#view/snippets/ExpertiseDiePicker.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import RollModePicker from "../RollModePicker.svelte";

    type Props = {
        attackRollData: any;
        options: ActionActivationOptions;
        attackRoll: AttackRollData;
    };

    function updateData() {
        attackRollData = {
            ...attackRoll,
            expertiseDie,
            rollMode,
            formula: rollFormula,
        };
    }

    let { attackRollData = $bindable(), options, attackRoll }: Props = $props();

    const actor: Actor = getContext("actor");
    const dialog: any = getContext("dialog");
    const item: Item = getContext("item");

    let situationalMods = $state("");

    let parts = $state(
        RollPreparationManager.prepareAttackRollData(
            actor,
            item,
            attackRoll,
            options,
        ),
    );

    let attackAbility = $derived(parts.attackAbility);
    let attackBonuses = $derived(parts.attackBonuses);
    let expertiseDie = $derived(parts.expertiseDie);
    let expertiseDieSource = $derived(parts.expertiseDieSource);
    let rollMode = $derived(parts.rollMode);
    let rollModeSource = $derived(parts.rollModeSource);
    let selectedAttackBonuses = $derived(parts.selectedAttackBonuses);

    let rollFormula = $derived(
        getRollFormula(actor, {
            ability: attackAbility,
            attackBonus: attackRoll?.bonus,
            attackType: attackRoll.attackType,
            expertiseDie,
            item: item,
            proficient: attackRoll?.proficient ?? true,
            situationalMods,
            rollMode,
            selectedAttackBonuses,
            type: "attack",
        }),
    );

    updateData();
    $effect(() => updateData());
</script>

<RollModePicker
    selected={rollMode.toString()}
    source={rollModeSource}
    onUpdateSelection={(detail) => (rollMode = detail)}
/>

<ExpertiseDiePicker
    source={expertiseDieSource}
    selected={expertiseDie}
    type={actor.type}
    onUpdateSelection={(value) => (expertiseDie = value)}
/>

{#if Object.values(attackBonuses).flat().length}
    <CheckboxGroup
        heading="Attack Bonuses"
        options={attackBonuses.map(([key, attackBonus]) => [
            key,
            attackBonus.label || attackBonus.defaultLabel || "",
        ])}
        selected={selectedAttackBonuses}
        onUpdateSelection={(detail) => (selectedAttackBonuses = detail)}
    />
{/if}

<FieldWrapper heading="A5E.SituationalMods">
    <input
        class="a5e-input a5e-input--slim"
        type="text"
        id="{actor.id}-{dialog.id}-situational-mod"
        bind:value={situationalMods}
    />
</FieldWrapper>

<section class="roll-formula-preview">
    {rollFormula}
</section>

<style lang="scss">
    .roll-formula-preview {
        padding: 0.5rem;
        font-size: var(--a5e-sm-text);
        border: 1px solid var(--a5e-border-color);
        border-radius: 4px;
    }
</style>
