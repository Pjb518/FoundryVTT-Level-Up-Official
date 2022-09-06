<script>
    import actionHasAttackRoll from "../../../utils/actionHasAttackRoll";

    import AbilityCheckConfig from "./AbilityCheckConfig.svelte";
    import AttackRollConfig from "./AttackRollConfig.svelte";
    import DamageRollConfig from "./DamageRollConfig.svelte";
    import GenericRollConfig from "./GenericRollConfig.svelte";
    import HealingRollConfig from "./HealingRollConfig.svelte";
    import RollConfigWrapper from "./RollConfigWrapper.svelte";
    import SavingThrowConfig from "./SavingThrowConfig.svelte";
    import SkillCheckConfig from "./SkillCheckConfig.svelte";
    import ToolCheckConfig from "./ToolCheckConfig.svelte";

    export let actionId;
    export let item;

    function addRoll() {
        const newRoll = {
            type: actionHasAttackRoll(action) ? "damage" : "attack",
        };

        $item.update({
            [`system.actions.${actionId}.rolls`]: {
                ...action.rolls,
                [foundry.utils.randomID()]: newRoll,
            },
        });
    }

    const configurationComponents = {
        abilityCheck: AbilityCheckConfig,
        attack: AttackRollConfig,
        damage: DamageRollConfig,
        healing: HealingRollConfig,
        generic: GenericRollConfig,
        savingThrow: SavingThrowConfig,
        skillCheck: SkillCheckConfig,
        toolCheck: ToolCheckConfig,
    };

    $: action = $item.system.actions[actionId];
</script>

<header class="section-header">
    <h2>Rolls</h2>

    <a on:click={addRoll}>+ Add Roll</a>
</header>

<ul class="section-list">
    {#each Object.entries(action.rolls ?? {}) as [rollId, roll] (rollId)}
        <RollConfigWrapper {actionId} {item} {roll} {rollId}>
            <svelte:component
                this={configurationComponents[roll.type]}
                {action}
                {actionId}
                {item}
                {roll}
                {rollId}
            />
        </RollConfigWrapper>
    {:else}
        <li class="none">None</li>
    {/each}
</ul>

<style lang="scss">
    .none {
        color: #555;
        text-align: center;
        font-size: 0.833rem;
    }

    .section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 0.25rem 0.25rem 0.25rem;
        font-size: 0.833rem;
        border-bottom: 1px solid #ccc;
    }

    .section-list {
        display: flex;
        flex-direction: column;
        margin: 0;
        padding: 0;
        gap: 0.25rem;
        list-style: none;
    }
</style>
