<script lang="ts">
import type { RollHandlerReturnType } from '../../dataPreparationHelpers/itemActivationRolls/prepareRolls';

import { RollPreparationManager } from '../../../managers/RollPreparationManager';

import CheckboxGroup from '../CheckboxGroup.svelte';
import FieldWrapper from '../FieldWrapper.svelte';

export let selectedRolls: string[];
export let rolls: RollHandlerReturnType;

const rollHeadingMap = {
	abilityCheck: 'Ability Checks',
	damage: 'Damage Rolls',
	generic: 'Generic Rolls',
	healing: 'Healing Rolls',
	savingThrow: 'Saving Throws',
	skillCheck: 'Skill Checks',
	toolCheck: 'Tool Checks',
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
                    on:updateSelection={(event) => (selectedRolls = event.detail)}
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
