<script lang="ts">
    import type { RollHandlerReturnType } from "../../../apps/dataPreparationHelpers/itemActivationRolls/prepareRolls.ts";

    import { RollPreparationManager } from "#managers/RollPreparationManager.ts";

    import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import type { RollStateManager } from "#managers/RollStateManager.ts";

    type Props = {
        selectedRolls: string[];
        rolls: RollHandlerReturnType;
        stateConfig: RollStateManager.state["config"];
    };

    let { selectedRolls = $bindable(), rolls, stateConfig }: Props = $props();

    const rollHeadingMap = {
        abilityCheck: "Ability Checks",
        damage: "Damage Rolls",
        generic: "Generic Rolls",
        healing: "Healing Rolls",
        savingThrow: "Saving Throws",
        skillCheck: "Skill Checks",
        toolCheck: "Tool Checks",
    };

    const { otherRolls } = RollPreparationManager.prepareOtherRollData(rolls);
    const disabledRolls = stateConfig.invalids.rolls;
</script>

<FieldWrapper hint="A5E.rollLabels.hint">
    <div class="roll-wrapper">
        {#each Object.entries(otherRolls) as [rollType, _rolls]}
            {#if _rolls.length}
                <CheckboxGroup
                    heading={rollHeadingMap[rollType]}
                    options={_rolls.map((roll) => [
                        roll.id,
                        roll.label || roll.defaultLabel,
                    ])}
                    red={disabledRolls}
                    disabledOptions={disabledRolls}
                    preferColor={true}
                    selected={selectedRolls}
                    onUpdateSelection={(detail) => (selectedRolls = detail)}
                />
            {/if}
        {/each}
    </div>
</FieldWrapper>

<style lang="scss">
    .roll-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
</style>
