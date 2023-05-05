<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import ActionsManager from "../../../managers/ActionsManager";

    import AbilityCheckRollConfig from "../itemActionsConfig/AbilityCheckRollConfig.svelte";
    import AttackRollConfig from "../itemActionsConfig/AttackRollConfig.svelte";
    import CreateMenu from "../actorUtilityBar/CreateMenu.svelte";
    import DamageRollConfig from "../itemActionsConfig/DamageRollConfig.svelte";
    import GenericRollConfig from "../itemActionsConfig/GenericRollConfig.svelte";
    import HealingRollConfig from "../itemActionsConfig/HealingRollConfig.svelte";
    import RollConfigWrapper from "../itemActionsConfig/RollConfigWrapper.svelte";
    import SavingThrowRollConfig from "../itemActionsConfig/SavingThrowRollConfig.svelte";
    import SkillCheckRollConfig from "../itemActionsConfig/SkillCheckRollConfig.svelte";
    import ToolCheckRollConfig from "../itemActionsConfig/ToolCheckRollConfig.svelte";

    const item = getContext("item");
    const actionId = getContext("actionId");

    const rollTypes = {
        attack: {
            heading: "A5E.ItemAttackRoll",
            singleLabel: "A5E.ItemAttackRoll",
            component: AttackRollConfig,
        },
        damage: {
            heading: "A5E.ItemDamageRollPlural",
            buttonLabel: "A5E.Damage",
            singleLabel: "A5E.ItemDamageRoll",
            component: DamageRollConfig,
        },
        healing: {
            heading: "A5E.ItemHealingRollPlural",
            singleLabel: "A5E.Healing",
            component: HealingRollConfig,
        },
        abilityCheck: {
            heading: "A5E.AbilityCheckPlural",
            singleLabel: "A5E.AbilityCheck",
            component: AbilityCheckRollConfig,
        },
        skillCheck: {
            heading: "A5E.SkillCheckPlural",
            singleLabel: "A5E.SkillCheckSingular",
            component: SkillCheckRollConfig,
        },
        toolCheck: {
            heading: "A5E.ToolCheckPlural",
            singleLabel: "A5E.ToolCheck",
            component: ToolCheckRollConfig,
        },
        savingThrow: {
            heading: "A5E.SavingThrowPlural",
            singleLabel: "A5E.SavingThrow",
            component: SavingThrowRollConfig,
        },
        generic: {
            heading: "A5E.OtherPlural",
            singleLabel: "A5E.Other",
            component: GenericRollConfig,
        },
    };

    $: action = $item.actions[actionId];
    $: rolls = action.rolls ?? {};

    $: attackRolls = Object.entries(action.rolls ?? {}).filter(
        ([_, roll]) => roll.type === "attack"
    );

    $: menuList = Object.entries(rollTypes).reduce(
        (acc, [rollType, { singleLabel }]) => {
            if (!(rollType === "attack" && attackRolls.length > 0))
                acc.push([rollType, singleLabel]);
            return acc;
        },
        []
    );
</script>

<article>
    <ul class="roll-config-list">
        {#each Object.entries(rollTypes) as [rollType, { heading, singleLabel, buttonLabel, component }] (rollType)}
            {#if Object.values(rolls).filter((roll) => roll.type === rollType).length}
                <li class="roll-config-list__item">
                    <header class="action-config__section-header">
                        <h2 class="action-config__section-heading">
                            {localize(heading)}
                        </h2>

                        {#if rollType !== "attack"}
                            <button
                                class="add-button"
                                on:click={() =>
                                    ActionsManager.addRoll(
                                        $item,
                                        [actionId, action],
                                        rollType
                                    )}
                            >
                                {localize("A5E.ButtonAddRoll", {
                                    type: localize(
                                        rollType === "damage"
                                            ? buttonLabel
                                            : singleLabel
                                    ),
                                })}
                            </button>
                        {/if}
                    </header>

                    <ul class="roll-list">
                        {#each Object.entries(rolls).filter(([_, roll]) => roll.type === rollType) as [rollId, roll] (rollId)}
                            <RollConfigWrapper {roll} {rollId}>
                                <svelte:component
                                    this={component}
                                    {roll}
                                    {rollId}
                                />
                            </RollConfigWrapper>
                        {:else}
                            <li class="action-config__none">
                                {localize("A5E.None")}
                            </li>
                        {/each}
                    </ul>
                </li>
            {/if}
        {/each}
    </ul>

    <div class="sticky-add-button">
        <CreateMenu
            {menuList}
            offset={{ x: -110, y: -140 }}
            documentName="Roll"
            on:press={({ detail }) =>
                ActionsManager.addRoll($item, [actionId, action], detail)}
        />
    </div>
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 0.75rem;
        overflow: hidden;
    }

    .roll-list {
        display: flex;
        flex-direction: column;
        position: relative;
        margin: 0;
        padding: 0;
        gap: 0.25rem;
        list-style: none;
    }

    .roll-config-list {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        gap: 0.75rem;
        list-style: none;
        padding: 0;
        margin: 0;
        overflow-y: auto;

        &__item {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
    }

    .sticky-add-button {
        display: flex;
        justify-content: space-around;
        align-items: center;
        color: #999;
    }
</style>
