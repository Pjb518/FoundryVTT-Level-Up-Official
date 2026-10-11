<script lang="ts">
  import { localize } from "#utils/localization/localize.ts";

  type Props = {
    checked: boolean;
    label: string;
    disabled?: boolean;
    onUpdateSelection: (checked: boolean) => void;
  };

  let { checked, label, onUpdateSelection, disabled = false }: Props = $props();

  const id = foundry.utils.randomID();
</script>

<div class="checkbox-wrapper">
  <input
    class="checkbox"
    type="checkbox"
    {disabled}
    {id}
    {checked}
    onchange={({ currentTarget }) => onUpdateSelection(currentTarget.checked)}
  />

  <label class="label" for={id}>
    {localize(label)}
  </label>
</div>

<style lang="scss">
  .checkbox {
    margin: var(--a5e-spacing-none);
    line-height: var(--a5e-sm-text);
  }

  .checkbox,
  .label {
    cursor: pointer;
  }

  .checkbox-wrapper {
    display: flex;
    align-items: center;
    font-size: var(--a5e-checkbox-text-size, var(--a5e-sm-text));
    gap: var(--a5e-spacing-sm);
    padding: var(--a5e-spacing-none);
  }
</style>
