<script>
  import { getContext } from "svelte";
  import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

  const item = getContext("item");
  const actionId = getContext("actionId");

  function addResource() {
    const newResource = {
      type: "temp",
    };

    $item.update({
      [`system.actions.${actionId}.resources`]: {
        ...action.resources,
        [foundry.utils.randomID()]: newResource,
      },
    });
  }

  function deleteResource(event) {
    const { resourceId } = event.target.closest(".resource").dataset;

    $item.update({
      [`system.actions.${actionId}.resources`]: {
        [`-=${resourceId}`]: null,
      },
    });
  }

  $: action = $item.system.actions[actionId];
</script>

<header class="section-header">
  <h2>Resource Consumption</h2>

  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-missing-attribute -->
  <a on:click={addResource}>+ Add Resource</a>
</header>

<ul class="resource-config-list">
  {#each Object.entries(action.resources ?? {}) as [resourceId, resource] (resourceId)}
    <li class="resource" data-resource-id={resourceId}>
      <!--  -->
      <h3>Label</h3>

      <h3>Resource</h3>
      <h3>Value</h3>
      <h3>Max</h3>
      <h3>Per</h3>

      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <i class="button--delete fas fa-trash" on:click={deleteResource} />
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

  .resource {
    display: flex;
    flex-direction: column;
    font-size: 1rem;
    position: relative;
  }

  .resource-config-list {
    display: flex;
    flex-direction: column;
    position: relative;
    margin: 0;
    padding: 0;
    gap: 0.25rem;
    list-style: none;
    font-family: "Modesto Condensed", serif;
  }

  .button--delete {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    cursor: pointer;
    transition: all 0.15s ease-in-out;

    &:hover {
      color: #8b2525;
      transform: scale(1.2);
    }
  }
</style>
