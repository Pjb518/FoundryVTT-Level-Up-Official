<svelte:options accessors={true} />

<script>
  import { getContext, setContext } from "svelte";

  import PromptsConfig from "../components/itemActionsConfig/PromptsConfig.svelte";
  import ResourceConfig from "../components/itemActionsConfig/ResourceConfig.svelte";
  import RollsConfig from "../components/itemActionsConfig/rollsConfig/RollsConfig.svelte";
  import TargetingConfig from "../components/itemActionsConfig/TargetingConfig.svelte";
  import NavigationBar from "../components/navigation/NavigationBar.svelte";

  import updateDocumentDataFromField from "../utils/updateDocumentDataFromField";

  export let { actionId, item } = getContext("external").application;

  function updateCurrentTab(event) {
    currentTab = tabs[event.detail];
  }

  const tabs = [
    {
      name: "targeting",
      label: "Targeting",
      component: TargetingConfig,
    },
    {
      name: "rolls",
      label: "Rolls",
      component: RollsConfig,
    },
    {
      name: "prompts",
      label: "Prompts",
      component: PromptsConfig,
    },
    {
      name: "resources",
      label: "Resources",
      component: ResourceConfig,
    },
  ];

  $: currentTab = tabs[0];

  setContext("item", item);
  setContext("actionId", actionId);
</script>

<main>
  <header class="action-header">
    <img class="item-image" src={$item.img} alt="${item.name} image" />

    <input
      class="a5e-input a5e-input--character-name"
      type="text"
      name="name"
      value={$item.system.actions[actionId]?.name}
      placeholder="Action Name"
      on:change={({ target }) =>
        updateDocumentDataFromField(
          $item,
          `system.actions.${actionId}.name`,
          target.value
        )}
    />
  </header>

  <NavigationBar {currentTab} {tabs} on:tab-change={updateCurrentTab} />

  <svelte:component this={currentTab.component} />
</main>

<style lang="scss">
  :global {
    .a5e-sheet .dialog-content {
      height: 100%;
    }
  }

  main {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 0.75rem;
    gap: 0.5rem;
    overflow: auto;
    background: rgba(246, 242, 235, 0.5);
  }

  .action-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .item-image {
    width: 3rem;
    height: 3rem;
    border-radius: 4px;
    cursor: pointer;
  }
</style>
