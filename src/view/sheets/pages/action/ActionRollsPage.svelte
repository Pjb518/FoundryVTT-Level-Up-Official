<script lang="ts">
    import type { Action } from "#types/action.d.ts";
    import type { ActionComponentType } from "#view/sheets/components/action/data.ts";

    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import { ActionsManager } from "#managers/ActionsManager.ts";

    import Section from "#view/snippets/Section.svelte";

    import AbilityCheckRollConfig from "../../components/action/AbilityCheckRollConfig.svelte";
    import AttackRollConfig from "../../components/action/AttackRollConfig.svelte";
    import DamageRollConfig from "../../components/action/DamageRollConfig.svelte";
    import GenericRollConfig from "../../components/action/GenericRollConfig.svelte";
    import HealingRollConfig from "../../components/action/HealingRollConfig.svelte";
    import SavingThrowRollConfig from "../../components/action/SavingThrowRollConfig.svelte";
    import SkillCheckRollConfig from "../../components/action/SkillCheckRollConfig.svelte";
    import ToolCheckRollConfig from "../../components/action/ToolCheckRollConfig.svelte";

    async function deleteRoll(actionId: string, rollId: string) {
        // Close Dialog
        const dialog = item.dialogs.rollScaling[rollId];
        await dialog?.close();
        delete item.dialogs.rollScaling[rollId];

        item.update({
            [`system.actions.${actionId}.rolls`]: {
                [`-=${rollId}`]: null,
            },
        });
    }

    function duplicateRoll(actionId: string, roll: Record<string, any>) {
        const newRoll = foundry.utils.duplicate(roll);

        item.update({
            [`system.actions.${actionId}.rolls`]: {
                [foundry.utils.randomID()]: newRoll,
            },
        });
    }

    let item: any = getContext("item");
    let actionId: string = getContext("actionId");

    const rollTypes: Record<string, ActionComponentType> = {
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
            heading: "A5E.skillLabels.checks.titlePlural",
            singleLabel: "A5E.skillLabels.checks.title",
            component: SkillCheckRollConfig,
        },
        toolCheck: {
            heading: "A5E.actions.labels.toolCheckPlural",
            singleLabel: "A5E.actions.labels.toolCheck",
            component: ToolCheckRollConfig,
        },
        savingThrow: {
            heading: "A5E.rollLabels.savingThrows.titlePlural",
            singleLabel: "A5E.rollLabels.savingThrows.title",
            component: SavingThrowRollConfig,
        },
        generic: {
            heading: "A5E.actions.labels.otherPlural",
            singleLabel: "A5E.actions.labels.other",
            component: GenericRollConfig,
        },
    };

    let action = $derived(item.reactive.actions.get(actionId));
    let rolls: [string, any][] = $derived(Object.entries(action.rolls ?? {}));
    let hasAttackRoll: boolean = $derived(
        rolls.some(([, roll]) => roll.type === "attack"),
    );
</script>

{#snippet RollListItem(rollType: string, rollConfig: ActionComponentType)}
    <Section
        heading={rollConfig.heading}
        headerButtons={rollType === "attack" && hasAttackRoll
            ? []
            : [
                  {
                      classes: "add-button",
                      handler: () =>
                          ActionsManager.addRoll(
                              item,
                              [actionId, action],
                              rollType,
                          ),
                      label: localize("A5E.buttons.addRoll", {
                          type: localize(
                              rollConfig.buttonLabel ?? rollConfig.singleLabel,
                          ),
                      }),
                  },
              ]}
        --a5e-section-gap="0"
    >
        <ul class="a5e-item-list">
            {#each rolls.filter(([, roll]) => roll.type === rollType) as [rollId, roll] (rollId)}
                <li class="a5e-item a5e-item--action-config">
                    <rollConfig.component
                        {deleteRoll}
                        {duplicateRoll}
                        {roll}
                        {rollId}
                    />
                </li>
            {/each}
        </ul>
    </Section>
{/snippet}

<div class="a5e-page-wrapper a5e-page-wrapper--scrollable">
    <ul class="a5e-action-config__list">
        {#each Object.entries(rollTypes) as [rollType, rollConfig] (rollType)}
            <!-- {#if rolls.filter(([, roll]) => roll.type === rollType).length} -->
            <li class="a5e-action-config__list-item">
                {@render RollListItem(rollType, rollConfig)}
            </li>
            <!-- {/if} -->
        {/each}
    </ul>
</div>
