<script>
  import { getContext } from "svelte";
  import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

  import AbilityCheckPromptConfig from "./promptsConfig/AbilityCheckPromptConfig.svelte";
  import PromptsConfigWrapper from "./promptsConfig/PromptsConfigWrapper.svelte";
  import SavePromptConfig from "./promptsConfig/SavePromptConfig.svelte";
  import SkillCheckPromptConfig from "./promptsConfig/SkillCheckPromptConfig.svelte";

  const item = getContext("item");
  const actionId = getContext("actionId");

  function addPrompt(type) {
    $item.update({
      [`system.actions.${actionId}.prompts`]: {
        ...action.prompts,
        [foundry.utils.randomID()]: { type },
      },
    });
  }

  const promptTypes = {
    savingThrow: {
      heading: "A5E.ActionConfigSavingThrowPrompt",
      component: SavePromptConfig,
    },
    abilityCheck: {
      heading: "A5E.ActionConfigAbilityCheckPrompt",
      component: AbilityCheckPromptConfig,
    },
    skillCheck: {
      heading: "A5E.ActionConfigSkillCheckPrompt",
      component: SkillCheckPromptConfig,
    },
    toolCheck: { heading: "A5E.ActionConfigToolCheckPrompt", component: null },
    generic: { heading: "A5E.ActionConfigGenericPrompt", component: null },
  };

  $: action = $item.system.actions[actionId];
</script>

<ul class="prompts-config-list">
  {#each Object.entries(promptTypes) as [promptType, { heading, component }] (promptType)}
    <li class="prompts-config-list__item">
      <header class="section-header">
        <h2 class="section-heading">{localize(heading)}</h2>

        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-missing-attribute -->
        <a on:click={() => addPrompt(promptType)}>+ Add Prompt</a>
      </header>

      <ul class="prompts-list">
        {#each Object.entries(action.prompts ?? {}).filter(([_, prompt]) => prompt.type === promptType) as [promptId, prompt] (promptId)}
          <PromptsConfigWrapper {prompt} {promptId}>
            <svelte:component this={component} {prompt} {promptId} />
          </PromptsConfigWrapper>
        {:else}
          <li class="none">{localize("A5E.None")}</li>
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

  .prompts-list {
    display: flex;
    flex-direction: column;
    position: relative;
    margin: 0;
    padding: 0;
    gap: 0.25rem;
    list-style: none;
  }

  .prompts-config-list {
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
