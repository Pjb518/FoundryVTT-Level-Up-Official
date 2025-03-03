<script lang="ts">
    import type { Writable } from "svelte/store";
    import type { ItemA5e } from "../../../documents/item/item";

    import { getContext } from "svelte";
    import { localize } from "#runtime/util/i18n";

    import { ActionsManager } from "../../../managers/ActionsManager";

    import AbilityCheckRollConfig from "../itemActionsConfig/AbilityCheckRollConfig.svelte";
    import AttackRollConfig from "../itemActionsConfig/AttackRollConfig.svelte";
    import CreateMenu from "../actorUtilityBar/CreateMenu.svelte";
    import DamageRollConfig from "../itemActionsConfig/DamageRollConfig.svelte";
    import GenericRollConfig from "../itemActionsConfig/GenericRollConfig.svelte";
    import HealingRollConfig from "../itemActionsConfig/HealingRollConfig.svelte";
    import SavingThrowRollConfig from "../itemActionsConfig/SavingThrowRollConfig.svelte";
    import Section from "../Section.svelte";
    import SkillCheckRollConfig from "../itemActionsConfig/SkillCheckRollConfig.svelte";
    import ToolCheckRollConfig from "../itemActionsConfig/ToolCheckRollConfig.svelte";

    async function deleteRoll(actionId: string, rollId: string) {
        // Close dialog
        const dialog = $item.dialogs.rollScaling[rollId];
        await dialog?.close();
        delete $item.dialogs.rollScaling[rollId];

        $item.update({
            [`system.actions.${actionId}.rolls`]: {
                [`-=${rollId}`]: null,
            },
        });
    }

    function duplicateRoll(actionId: string, roll: string) {
        const newRoll = foundry.utils.duplicate(roll);

        $item.update({
            [`system.actions.${actionId}.rolls`]: {
                [foundry.utils.randomID()]: newRoll,
            },
        });
    }

    const item: Writable<ItemA5e> = getContext("item");
    const actionId: string = getContext("actionId");

    const rollTypes = {
        attack: {
            heading: "A5E.items.headings.attackRoll",
            singleLabel: "A5E.items.headings.attackRoll",
            component: AttackRollConfig,
        },
        damage: {
            heading: "A5E.actions.labels.damageRollPlural",
            buttonLabel: "A5E.damage.title",
            singleLabel: "A5E.actions.labels.damageRoll",
            component: DamageRollConfig,
        },
        healing: {
            heading: "A5E.actions.labels.healingRollPlural",
            singleLabel: "A5E.healing.title",
            component: HealingRollConfig,
        },
        abilityCheck: {
            heading: "A5E.abilities.headings.checkPlural",
            singleLabel: "A5E.abilities.headings.check",
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
            heading: "A5E.actions.labels.otherPlural",
            singleLabel: "A5E.actions.labels.other",
            component: GenericRollConfig,
        },
    };

    $: action = $item.actions.get(actionId)!;
    $: rolls = action.rolls ?? {};

    $: attackRolls = Object.entries(action.rolls ?? {}).filter(
        ([_, roll]) => roll.type === "attack",
    );

    $: menuList = Object.entries(rollTypes).reduce((acc, [rollType, { singleLabel }]) => {
        if (!(rollType === "attack" && attackRolls.length > 0))
            acc.push([rollType, singleLabel]);
        return acc;
    }, [] as string[][]);
</script>

<div class="a5e-page-wrapper a5e-page-wrapper--scrollable">
    <ul class="roll-config-list">
        {#each Object.entries(rollTypes) as [rollType, { heading, singleLabel, buttonLabel, component }] (rollType)}
            {#if Object.values(rolls).filter((roll) => roll.type === rollType).length}
                <li class="roll-config-list__item">
                    <Section
                        {heading}
                        headerButtons={rollType === "attack"
                            ? []
                            : [
                                  {
                                      classes: "add-button",
                                      handler: () =>
                                          ActionsManager.addRoll(
                                              $item,
                                              [actionId, action],
                                              rollType,
                                          ),
                                      label: localize("A5E.buttons.addRoll", {
                                          type: localize(
                                              rollType === "damage"
                                                  ? buttonLabel
                                                  : singleLabel,
                                          ),
                                      }),
                                  },
                              ]}
                        --a5e-section-gap="0"
                    >
                        <ul class="a5e-item-list">
                            {#each Object.entries(rolls).filter(([_, roll]) => roll.type === rollType) as [rollId, roll] (rollId)}
                                <li class="a5e-item a5e-item--action-config">
                                    <svelte:component
                                        this={component}
                                        {deleteRoll}
                                        {duplicateRoll}
                                        {roll}
                                        {rollId}
                                    />
                                </li>
                            {/each}
                        </ul>
                    </Section>
                </li>
            {/if}
        {/each}
    </ul>
</div>

<div class="sticky-add-button">
    <CreateMenu
        {menuList}
        offset={{ x: -110, y: -140 }}
        documentName="Roll"
        on:press={({ detail }) =>
            ActionsManager.addRoll($item, [actionId, action], detail)}
    />
</div>

<style lang="scss">
    .roll-config-list {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        gap: 0.75rem;
        list-style: none;
        margin: 0;
        margin-right: -0.375rem;
        padding: 0;
        padding-right: 0.375rem;
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
        color: var(--a5e-button-gray);
    }
</style>
