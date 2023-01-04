<script>
  import { getContext } from "svelte";
  import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

  import AbilityCheckRollConfig from "../itemActionsConfig/AbilityCheckRollConfig.svelte";
  import AttackRollConfig from "../itemActionsConfig/AttackRollConfig.svelte";
  import DamageRollConfig from "../itemActionsConfig/DamageRollConfig.svelte";
  import GenericRollConfig from "../itemActionsConfig/GenericRollConfig.svelte";
  import HealingRollConfig from "../itemActionsConfig/HealingRollConfig.svelte";
  import RollConfigWrapper from "../itemActionsConfig/RollConfigWrapper.svelte";
  import SavingThrowRollConfig from "../itemActionsConfig/SavingThrowRollConfig.svelte";
  import SkillCheckRollConfig from "../itemActionsConfig/SkillCheckRollConfig.svelte";
  import ToolCheckRollConfig from "../itemActionsConfig/ToolCheckRollConfig.svelte";

  const item = getContext("item");
  const actionId = getContext("actionId");

  function addRoll(type) {
    if (type === "attack" && attackRolls.length > 0)
      return ui.notifications.error(
        "An action can have no more than 1 attack roll."
      );

    $item.update({
      [`system.actions.${actionId}.rolls`]: {
        ...action.rolls,
        [foundry.utils.randomID()]: { type },
      },
    });
  }

  const rollTypes = {
    attack: { heading: "Attack Rolls", component: AttackRollConfig },
    damage: { heading: "Damage Rolls", component: DamageRollConfig },
    healing: { heading: "Healing Rolls", component: HealingRollConfig },
    abilityCheck: {
      heading: "Ability Checks",
      component: AbilityCheckRollConfig,
    },
    skillCheck: { heading: "Skill Checks", component: SkillCheckRollConfig },
    toolCheck: { heading: "Tool Checks", component: ToolCheckRollConfig },
    savingThrow: { heading: "Saving Throws", component: SavingThrowRollConfig },
    generic: { heading: "Other", component: GenericRollConfig },
  };

  $: action = $item.system.actions[actionId];

  $: attackRolls = Object.entries(action.rolls ?? {}).filter(
    ([_, roll]) => roll.type === "attack"
  );
</script>

<ul class="roll-config-list">
  {#each Object.entries(rollTypes) as [rollType, { heading, component }] (rollType)}
    <li class="roll-config-list__item">
      <header class="action-config__section-header">
        <h2 class="action-config__section-heading">{localize(heading)}</h2>

        {#if !(rollType === "attack" && attackRolls.length > 0)}
          <button class="add-button" on:click={() => addRoll(rollType)}>
            + Add Roll
          </button>
        {/if}
      </header>

      <ul class="roll-list">
        {#each Object.entries(action.rolls ?? {}).filter(([_, roll]) => roll.type === rollType) as [rollId, roll] (rollId)}
          <RollConfigWrapper {roll} {rollId}>
            <svelte:component this={component} {roll} {rollId} />
          </RollConfigWrapper>
        {:else}
          <li class="action-config__none">None</li>
        {/each}
      </ul>
    </li>
  {/each}
</ul>

<style lang="scss">
  .section-heading {
    font-size: 1rem;
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
    gap: 0.75rem;
    list-style: none;
    padding: 0;
    margin: 0;

    &__item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  }
</style>
