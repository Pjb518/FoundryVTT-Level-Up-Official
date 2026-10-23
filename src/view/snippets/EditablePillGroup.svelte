<script lang="ts">
  import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
  import Pill from "#view/snippets/Pill.svelte";

  type Props = {
    heading?: string;
    hint?: string;
    values: string[] | Set<string>;
    preProcessValue?: (value: string) => string;
    onUpdateSelection?: (detail: string[] | Set<string>) => void;
  };

  function addValue(value: string) {
    if (preProcessValue) value = preProcessValue(value);

    if (Array.isArray(values)) onUpdateSelection([...values, value]);
    else onUpdateSelection(new Set([...values, value]));
  }

  function onRemoveValue(value: string) {
    // @ts-expect-error
    onUpdateSelection(values.filter((v) => v !== value));
  }

  let {
    heading = "",
    hint = "",
    values,
    preProcessValue,
    onUpdateSelection = () => {},
  }: Props = $props();
</script>

<FieldWrapper {heading} {hint}>
  <ul class="a5e-editable-pill-group">
    {#each values as value}
      <Pill
        label={value}
        {value}
        isButton={true}
        iconAfter="fa-solid fa-x"
        onclick={(v) => onRemoveValue(v)}
      />
    {/each}
  </ul>

  <input
    type="text"
    class="a5e-input a5e-input--slim"
    onchange={({ currentTarget }) => {
      addValue(currentTarget.value);
    }}
  />
</FieldWrapper>

<style lang="scss">
  .a5e-editable-pill-group {
    display: flex;
    gap: var(--a5e-spacing-sm);
    flex-wrap: wrap;

    padding: var(--a5e-spacing-none);
    margin: var(--a5e-spacing-none);
    list-style: none;
  }
</style>
