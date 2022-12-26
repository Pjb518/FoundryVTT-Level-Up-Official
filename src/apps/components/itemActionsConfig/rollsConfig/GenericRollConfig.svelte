<script>
  import { getContext } from "svelte";

  import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

  const item = getContext("item");
  const actionId = getContext("actionId");

  export let roll;
  export let rollId;
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

<div class="field-group field-group--formula">
  <label for={`${actionId}-${rollId}-roll-formula`}> Roll Formula </label>

  <input
    id={`${actionId}-${rollId}-roll-formula`}
    name={`${actionId}-${rollId}-roll-formula`}
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
</style>
