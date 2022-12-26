<script>
  import { getContext } from "svelte";
  import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

  import PromptsConfigWrapper from "./PromptsConfigWrapper.svelte";

  const item = getContext("item");
  const actionId = getContext("actionId");

  function addPrompt() {
    const newPrompt = {
      type: "save",
    };

    $item.update({
      [`system.actions.${actionId}.prompts`]: {
        ...action.prompts,
        [foundry.utils.randomID()]: newPrompt,
      },
    });
  }

  $: action = $item.system.actions[actionId];
</script>

<header class="section-header">
  <h2>Prompts</h2>

  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-missing-attribute -->
  <a on:click={addPrompt}>+ Add Prompt</a>
</header>

<ul class="prompt-config-list">
  {#each Object.entries(action.prompts ?? {}) as [promptId, prompt] (promptId)}
    <li class="prompt" data-prompt-id={promptId}>
      <PromptsConfigWrapper {prompt}>
        {prompt.type}
      </PromptsConfigWrapper>
    </li>
  {:else}
    <li class="none">{localize("A5E.None")}</li>
  {/each}
</ul>

<style lang="scss">
  .none {
    color: #555;
    text-align: center;
    font-size: 1rem;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.25rem 0.25rem 0.25rem;
    font-family: "Modesto Condensed", serif;
    font-size: 1rem;
    border-bottom: 1px solid #ccc;
  }

  .prompt {
    display: flex;
    flex-direction: column;
    // align-items: center;
    // justify-content: space-between;
    // padding: 0.5rem;
    // border: 1px solid #bbb;
    // border-radius: 3px;
    font-size: 1rem;
  }

  .prompt-config-list {
    display: flex;
    flex-direction: column;
    position: relative;
    margin: 0;
    padding: 0;
    gap: 0.25rem;
    list-style: none;
    font-family: "Modesto Condensed", serif;
  }
</style>
