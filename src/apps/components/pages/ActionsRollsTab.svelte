<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import {
        TJSMenu,
        TJSToggleIconButton,
    } from "@typhonjs-fvtt/svelte-standard/component";

    import AbilityCheckRollConfig from "../itemActionsConfig/AbilityCheckRollConfig.svelte";
    import AttackRollConfig from "../itemActionsConfig/AttackRollConfig.svelte";
    import DamageRollConfig from "../itemActionsConfig/DamageRollConfig.svelte";
    import GenericRollConfig from "../itemActionsConfig/GenericRollConfig.svelte";
    import HealingRollConfig from "../itemActionsConfig/HealingRollConfig.svelte";
    import RollConfigWrapper from "../itemActionsConfig/RollConfigWrapper.svelte";
    import SavingThrowRollConfig from "../itemActionsConfig/SavingThrowRollConfig.svelte";
    import SkillCheckRollConfig from "../itemActionsConfig/SkillCheckRollConfig.svelte";
    import ToolCheckRollConfig from "../itemActionsConfig/ToolCheckRollConfig.svelte";
    import ActionsAddMenu from "../ActionsAddMenu.svelte";

    const item = getContext("item");
    const actionId = getContext("actionId");

    function addRoll(type) {
        const rollData = { type, default: true };

        if (type === "attack" && attackRolls.length > 0)
            return ui.notifications.error(
                "An action can have no more than 1 attack roll."
            );

        if (type === "attack") {
            rollData.attackType = "meleeWeaponAttack";
            rollData.proficient = true;
        }

        if (type === "abilityCheck" || type === "savingThrow") {
            rollData.ability = "str";
        }

        if (type === "skillCheck") {
            rollData.skill = "acr";
        }

        if (type === "toolCheck") {
            rollData.tool = "airVehicles";
        }

        $item.update({
            [`system.actions.${actionId}.rolls`]: {
                ...action.rolls,
                [foundry.utils.randomID()]: rollData,
            },
        });
    }

    const rollTypes = {
        attack: { heading: "A5E.ItemAttackRoll", component: AttackRollConfig },
        damage: {
            heading: "A5E.ItemDamageRollPlural",
            component: DamageRollConfig,
        },
        healing: {
            heading: "A5E.ItemHealingRollPlural",
            component: HealingRollConfig,
        },
        abilityCheck: {
            heading: "A5E.AbilityCheckPlural",
            component: AbilityCheckRollConfig,
        },
        skillCheck: {
            heading: "A5E.SkillCheckPlural",
            component: SkillCheckRollConfig,
        },
        toolCheck: {
            heading: "A5E.ToolCheckPlural",
            component: ToolCheckRollConfig,
        },
        savingThrow: {
            heading: "A5E.SavingThrowPlural",
            component: SavingThrowRollConfig,
        },
        generic: { heading: "A5E.Other", component: GenericRollConfig },
    };

    $: action = $item.actions[actionId];
    $: attackRolls = Object.entries(action.rolls ?? {}).filter(
        ([_, roll]) => roll.type === "attack"
    );
    $: rolls = action.rolls ?? {};

    $: menuItems = Object.entries(rollTypes).reduce(
        (acc, [rollType, { heading }]) => {
            if (!(rollType === "attack" && attackRolls.length > 0))
                acc.push({ heading, rollType });
            return acc;
        },
        []
    );
</script>

<article>
    <ul class="roll-config-list">
        {#each Object.entries(rollTypes) as [rollType, { heading, component }] (rollType)}
            {#if Object.values(rolls).filter((roll) => roll.type === rollType).length}
                <li class="roll-config-list__item">
                    <header class="action-config__section-header">
                        <h2 class="action-config__section-heading">
                            {localize(heading)}
                        </h2>

                        {#if !(rollType === "attack" && attackRolls.length > 0)}
                            <button
                                class="add-button"
                                on:click={() => addRoll(rollType)}
                            >
                                {localize("A5E.ButtonAddRoll")}
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
        <TJSToggleIconButton title="A5E.ButtonAddRoll" icon="fas fa-plus">
            <TJSMenu offset={{ x: -110, y: -140 }}>
                <ActionsAddMenu
                    menuList={menuItems}
                    on:press={({ detail }) => addRoll(detail)}
                />
            </TJSMenu>
        </TJSToggleIconButton>
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
    }
</style>
