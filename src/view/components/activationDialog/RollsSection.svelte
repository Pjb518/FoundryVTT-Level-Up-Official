<script lang="ts">
    import type { RollHandlerReturnType } from "../../../apps/dataPreparationHelpers/itemActivationRolls/prepareRolls.ts";

    import { RollPreparationManager } from "#managers/RollPreparationManager.ts";

    import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";

    type Props = {
        selectedRolls: string[];
        rolls: RollHandlerReturnType;
    };

    let { selectedRolls = $bindable(), rolls }: Props = $props();

    const rollHeadingMap = {
        abilityCheck: "Ability Checks",
        damage: "Damage Rolls",
        generic: "Generic Rolls",
        healing: "Healing Rolls",
        savingThrow: "Saving Throws",
        skillCheck: "Skill Checks",
        toolCheck: "Tool Checks",
    };

    const { invalidSelections: disabledRolls, otherRolls } =
        RollPreparationManager.prepareOtherRollData(rolls);
</script>

<FieldWrapper hint="A5E.rollLabels.hint">
    <div class="roll-wrapper">
        {#each Object.entries(otherRolls) as [rollType, _rolls]}
            {#if _rolls.length}
                <CheckboxGroup
                    heading={rollHeadingMap[rollType]}
                    options={_rolls.map(([key, roll]) => [
                        key,
                        roll.label || roll.defaultLabel,
                    ])}
                    disabledOptions={disabledRolls}
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
