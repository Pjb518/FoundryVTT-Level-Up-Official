<script>
  import { getContext } from "svelte";
  import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

  import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

  const item = getContext("item");
  const actionId = getContext("actionId");

  const { resourceRecoveryOptions } = CONFIG.A5E;

  function addResource() {
    const newResource = {
      label: "",
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
      <div class="field-group field-group--label">
        <label for={`${actionId}-${resourceId}-label`}> Label </label>

        <input
          id={`${actionId}-${resourceId}-label`}
          name={`${actionId}-${resourceId}-label`}
          type="text"
          value={resource.label ?? ""}
          on:change={({ target }) =>
            updateDocumentDataFromField(
              $item,
              `system.actions.${actionId}.resources.${resourceId}.label`,
              target.value
            )}
        />
      </div>

      <div class="field-group field-group--source">
        <label for={`${actionId}-${resourceId}-source`}> Source </label>

        <input
          id={`${actionId}-${resourceId}-source`}
          name={`${actionId}-${resourceId}-source`}
          type="text"
          value={resource.source ?? ""}
          on:change={({ target }) =>
            updateDocumentDataFromField(
              $item,
              `system.actions.${actionId}.resources.${resourceId}.source`,
              target.value
            )}
        />
      </div>

      <div class="field-group field-group--resource">
        <div class="u-flex u-flex-col u-gap-xs u-w-30">
          <h3 class="u-text-sm">{localize("A5E.UsesCurrent")}</h3>

          <input
            class="a5e-input"
            type="number"
            name={`system.actions.${actionId}.resources.${resourceId}.value`}
            value={resource.value ?? 0}
            on:change={({ target }) =>
              updateDocumentDataFromField(
                $item,
                target.name,
                Number(target.value)
              )}
          />
        </div>

        <div class="u-flex u-flex-col u-gap-xs u-w-30">
          <h3 class="u-text-sm">{localize("A5E.UsesMax")}</h3>

          <input
            class="a5e-input"
            type="number"
            name={`system.actions.${actionId}.resources.${resourceId}.max`}
            value={resource.max ?? 0}
            on:change={({ target }) =>
              updateDocumentDataFromField(
                $item,
                target.name,
                Number(target.value)
              )}
          />
        </div>

        <div class="u-flex u-flex-col u-gap-xs u-w-30">
          <h3 class="u-text-sm">{localize("A5E.UsesPer")}</h3>

          <select
            class="u-h-8 u-w-40"
            name={`system.actions.${actionId}.resources.${resourceId}.per`}
            value={resource.per ?? ""}
            on:change={({ target }) =>
              updateDocumentDataFromField($item, target.name, target.value)}
          >
            <option value="" />

            {#each Object.entries(resourceRecoveryOptions) as [key, name]}
              <option
                {key}
                value={key}
                selected={$item.system.uses.per === key}
              >
                {localize(name)}
              </option>
            {/each}
          </select>
        </div>
      </div>

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
    gap: 0.5rem;
    position: relative;
    padding: 0.75rem;
    font-size: 0.833rem;
    background-color: rgba(0 0 0 / 0.05);
    border: 1px solid #b2b0ae;
    border-radius: 4px;
    font-size: 1rem;
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
    top: 0.75rem;
    right: 0.75rem;
    color: #999;
    cursor: pointer;
    transition: all 0.15s ease-in-out;

    &:hover {
      color: #8b2525;
      transform: scale(1.2);
    }
  }

  //   ==========================================================
  .field-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    &--source {
      flex-grow: 1;
    }

    &--label {
      margin-right: 4.5rem;
    }

    &--resource {
      flex-direction: row;
      gap: 0.75rem;
    }

    input[type="text"],
    input[type="number"] {
      width: 100%;
    }
  }
</style>
