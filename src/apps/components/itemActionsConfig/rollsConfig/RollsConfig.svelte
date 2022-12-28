<script>
  import { getContext } from "svelte";
  import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

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

  const item = getContext("item");
  const actionId = getContext("actionId");

  function addRoll(type) {
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
      component: AbilityCheckConfig,
    },
    skillCheck: { heading: "Skill Checks", component: SkillCheckConfig },
    toolCheck: { heading: "Tool Checks", component: ToolCheckConfig },
    savingThrow: { heading: "Saving Throws", component: SavingThrowConfig },
    generic: { heading: "Other", component: GenericRollConfig },
  };

  $: action = $item.system.actions[actionId];
</script>

<ul class="roll-config-list">
  {#each Object.entries(rollTypes) as [rollType, { heading, component }] (rollType)}
    <li class="roll-config-list__item">
      <header class="section-header">
        <h2 class="section-heading">{localize(heading)}</h2>

        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-missing-attribute -->
        <a on:click={() => addRoll(rollType)}>+ Add Roll</a>
      </header>

      <ul class="roll-list">
        {#each Object.entries(action.rolls ?? {}).filter(([_, roll]) => roll.type === rollType) as [rollId, roll] (rollId)}
          <RollConfigWrapper {roll} {rollId}>
            <svelte:component this={component} {roll} {rollId} />
          </RollConfigWrapper>
        {:else}
          <li class="none">None</li>
        {/each}
      </ul>
    </li>
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
