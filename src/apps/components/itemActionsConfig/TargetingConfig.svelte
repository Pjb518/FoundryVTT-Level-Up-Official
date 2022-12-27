<script>
  import { getContext } from "svelte";
  import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

  import AreaConfig from "./areaConfig/AreaConfig.svelte";
  import RangeIncrement from "./targetConfig/RangeIncrement.svelte";

  import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

  const item = getContext("item");
  const actionId = getContext("actionId");

  function addRangeIncrement() {
    const newRange = {
      range: "",
    };

    $item.update({
      [`system.actions.${actionId}.ranges`]: {
        ...action.ranges,
        [foundry.utils.randomID()]: newRange,
      },
    });
  }

  function selectTarget(event) {
    const selectedOption = event.target?.selectedOptions[0]?.value;

    if (selectedOption === "null") {
      $item.update({
        [`system.actions.${actionId}`]: {
          "-=target": null,
        },
      });
    } else {
      $item.update({
        [`system.actions.${actionId}.target`]: {
          type: selectedOption,
        },
      });
    }
  }

  $: action = $item.system.actions[actionId];
</script>

<section class="form-wrapper">
  <section class="form-section">
    <header class="section-header">
      <h2>Ranges</h2>

      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-missing-attribute -->
      <a on:click={addRangeIncrement}>+ Add Range Increment</a>
    </header>

    <ul class="section-list">
      {#each Object.entries(action.ranges ?? {}) as [id, { range }], index (id)}
        <li class="range-increment" data-range-id={id}>
          <RangeIncrement {index} {id} {range} />
        </li>
      {:else}
        <li class="none">None</li>
      {/each}
    </ul>
  </section>

  <AreaConfig {action} {actionId} {item} />

  <section class="form-section">
    <header class="section-header">
      <h2>Target</h2>
    </header>

    <div class="u-flex u-gap-md">
      {#if ["creature", "object", "creatureObject"].includes(action.target?.type)}
        <input
          class="target-quantity-input"
          type="number"
          name="targetQuantity"
          value={action.target?.quantity ?? 1}
          on:change={({ target }) =>
            updateDocumentDataFromField(
              $item,
              `system.actions.${actionId}.target.quantity`,
              Number(target.value || 0)
            )}
          on:click={({ target }) => target.select()}
        />
      {/if}

      <select class="u-w-fit" name="data.target.type" on:change={selectTarget}>
        <!-- svelte-ignore missing-declaration (foundry) -->
        <option value={null} selected={foundry.utils.isEmpty(action?.target)}>
          {localize("A5E.None")}
        </option>

        <!-- svelte-ignore missing-declaration (CONFIG)-->
        {#each Object.entries(CONFIG.A5E.targetTypes) as [key, name] (key)}
          <option value={key} selected={action?.target?.type === key}>
            {localize(name)}
          </option>
        {/each}
      </select>
    </div>
  </section>
</section>

<style lang="scss">
  .form {
    &-section {
      gap: 0.5rem;
    }

    &-section,
    &-wrapper {
      display: flex;
      flex-direction: column;
    }

    &-wrapper {
      gap: 1rem;
    }
  }

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
    border-bottom: 1px solid #ccc;
  }

  .range-increment {
    border-radius: 4px;
    font-size: 1rem;
  }

  .section-list {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    gap: 0.25rem;
    list-style: none;
    font-family: "Modesto Condensed", serif;
  }

  .target-quantity-input {
    width: 4rem;
    text-align: center;
  }
</style>
