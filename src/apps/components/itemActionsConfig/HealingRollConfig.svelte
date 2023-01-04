<script>
  import { getContext } from "svelte";
  import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
  import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

  const item = getContext("item");
  const actionId = getContext("actionId");
  const { healingTypes } = CONFIG.A5E;

  export let roll;
  export let rollId;
</script>

<section class="action-config__wrapper">
  <div class="a5e-field-group a5e-field-group--label">
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

  <div class="row">
    <div class="a5e-field-group a5e-field-group--formula">
      <label for={`${actionId}-${rollId}-healing-formula`}>
        Healing Formula
      </label>

      <input
        id={`${actionId}-${rollId}-healing-formula`}
        name={`${actionId}-${rollId}-healing-formula`}
        type="text"
        value={roll.formula ?? ""}
        on:change={({ target }) =>
          updateDocumentDataFromField(
            $item,
            `system.actions.${actionId}.rolls.${rollId}.formula`,
            target.value
          )}
      />
    </div>

    <div class="a5e-field-group">
      <label for={`${actionId}-${rollId}-healing-type`}>Healing Type</label>

      <select
        id={`${actionId}-${rollId}-healing-type`}
        class="u-w-fit"
        name={`${actionId}-${rollId}-healing-type`}
        on:change={({ target }) =>
          updateDocumentDataFromField(
            $item,
            `system.actions.${actionId}.rolls.${rollId}.healingType`,
            target.value
          )}
      >
        {#each Object.entries(healingTypes) as [key, name] (key)}
          <option value={key} selected={roll.healingTypes === key}>
            {localize(name)}
          </option>
        {/each}
      </select>
    </div>
  </div>

  <div class="a5e-field-group a5e-field-group--checkbox">
    <input
      id={`${actionId}-${rollId}-default`}
      class="checkbox"
      name={`${actionId}-${rollId}-default`}
      type="checkbox"
      checked={roll.default ?? true}
      on:change={({ target }) =>
        updateDocumentDataFromField(
          $item,
          `system.actions.${actionId}.rolls.${rollId}.default`,
          target.checked
        )}
    />

    <label for={`${actionId}-${rollId}-default`}
      >{localize("A5E.HealingDefaultSelection")}</label
    >
  </div>
</section>

<style lang="scss">
  .checkbox {
    margin: 0;
  }

  .row {
    display: flex;
    gap: 0.5rem;
    width: 100%;
  }
</style>
