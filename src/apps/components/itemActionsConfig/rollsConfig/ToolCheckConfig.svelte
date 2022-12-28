<script>
  import { getContext } from "svelte";
  import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

  import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

  const item = getContext("item");
  const actionId = getContext("actionId");

  const { abilities } = CONFIG.A5E;
  const tools = Object.entries(CONFIG.A5E.tools)
    .map(([_, tools]) => Object.entries(tools))
    .flat()
    .sort((a, b) => a[0].toLowerCase().localeCompare(b[0].toLowerCase()));

  export let roll;
  export let rollId;

  $: roll = $item.system.actions[actionId]?.rolls[rollId];
</script>

<div class="field-group field-group--label">
  <label for={`${actionId}-${rollId}-label`}>Label</label>

  <input
    id={`${actionId}-${rollId}-label`}
    name={`${actionId}-${rollId}-label`}
    type="text"
    value={roll.label ?? ""}
    on:change={({ target }) =>
      updateDocumentDataFromField(
        $item,
        `system.actions.${actionId}.rolls.${rollId}.label`,
        target.value
      )}
  />
</div>

<div class="option-wrapper">
  <h3>Tool</h3>

  <select
    name={`${actionId}-${rollId}-tool`}
    id={`${actionId}-${rollId}-tool`}
    class="u-w-fit"
    on:change={({ target }) =>
      updateDocumentDataFromField(
        $item,
        `system.actions.${actionId}.rolls.${rollId}.tool`,
        target.value
      )}
  >
    <!-- svelte-ignore missing-declaration -->
    <option value="" selected={foundry.utils.isEmpty(roll?.tool)}>
      {localize("A5E.None")}
    </option>

    {#each tools as [tool, label]}
      <option value={tool} selected={roll?.tool === tool}>
        {localize(label)}
      </option>
    {/each}
  </select>
</div>

<div class="option-wrapper">
  <h3>Default Ability Score</h3>

  <div class="option-list">
    <input
      class="option-input"
      type="radio"
      name={`${actionId}-${rollId}-ability`}
      id={`${actionId}-${rollId}-ability-none`}
      value=""
      checked={(roll.ability ?? true) || roll.ability === ""}
      on:change={() =>
        updateDocumentDataFromField(
          $item,
          `system.actions.${actionId}.rolls.${rollId}`,
          { "-=ability": null }
        )}
    />

    <label class="option-label" for={`${actionId}-${rollId}-ability-none`}>
      {localize("A5E.None")}
    </label>

    {#each Object.entries(abilities) as [ability, label]}
      <input
        class="option-input"
        type="radio"
        name={`${actionId}-${rollId}-ability`}
        id={`${actionId}-${rollId}-ability-${ability}`}
        value={ability}
        checked={roll.ability === ability}
        on:change={({ target }) =>
          updateDocumentDataFromField(
            $item,
            `system.actions.${actionId}.rolls.${rollId}.ability`,
            target.value
          )}
      />

      <label
        class="option-label"
        for={`${actionId}-${rollId}-ability-${ability}`}
      >
        {localize(label)}
      </label>
    {/each}
  </div>
</div>

<div class="field-group">
  <label for={`${actionId}-${rollId}-bonus`}> Check Bonus </label>

  <input
    id={`${actionId}-${rollId}-bonus`}
    name={`${actionId}-${rollId}-bonus`}
    type="text"
    value={roll.bonus ?? ""}
    on:change={({ target }) =>
      updateDocumentDataFromField(
        $item,
        `system.actions.${actionId}.rolls.${rollId}.bonus`,
        target.value
      )}
  />
</div>

<style lang="scss">
  .field-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    &--label {
      margin-right: 4.5rem;
    }

    input[type="text"] {
      width: 100%;
    }
  }

  .option {
    &-input {
      display: none;

      &:checked + .option-label {
        background: #2b6537;
        border-color: darken($color: #2b6537, $amount: 5);
        color: #f6f2eb;
      }
    }

    &-label {
      border-radius: 3px;
      border: 1px solid #bbb;
      padding: 0.125rem 0.25rem;
      cursor: pointer;
      transition: all 0.15s ease-in-out;
    }

    &-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
    }

    &-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.694rem;
      font-family: "Signika", sans-serif;
    }
  }
</style>
