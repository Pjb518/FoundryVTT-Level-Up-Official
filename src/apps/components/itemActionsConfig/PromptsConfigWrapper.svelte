<script>
  import { getContext } from "svelte";

  const item = getContext("item");
  const actionId = getContext("actionId");

  function deletePrompt(event) {
    const { promptId } = event.target.closest(".prompt").dataset;

    $item.update({
      [`system.actions.${actionId}.prompts`]: {
        [`-=${promptId}`]: null,
      },
    });
  }

  function duplicatePrompt() {
    const newPrompt = foundry.utils.duplicatePrompt(prompt);

    $item.update({
      [`system.actions.${actionId}.prompts`]: {
        [foundry.utils.randomID()]: newPrompt,
      },
    });
  }

  export let prompt;
</script>

<article class="prompt-wrapper">
  <div class="button-wrapper">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <i class="button fa-solid fa-clone" on:click={duplicatePrompt} />
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <i class="button button--delete fas fa-trash" on:click={deletePrompt} />
  </div>

  <slot />
</article>

<style lang="scss">
  .button-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    color: #999;
    font-size: 1rem;
  }

  .prompt-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    position: relative;
    padding: 0.75rem;
    font-size: 0.833rem;
    // background: rgba(246, 242, 235, 0.4);
    background-color: rgba(0, 0, 0, 0.05);
    border: 1px solid #b2b0ae;
    border-radius: 4px;
  }

  .button {
    margin: 0;
    padding: 0.25rem;
    cursor: pointer;
    transition: all 0.15s ease-in-out;

    &:hover {
      transform: scale(1.2);
    }
  }

  .button {
    margin: 0;
    padding: 0.25rem;
    cursor: pointer;
    transition: all 0.15s ease-in-out;

    &:hover {
      color: #555;
      transform: scale(1.2);
    }

    &--delete:hover {
      color: #8b2525;
    }
  }
</style>
