<script lang="ts">
  type Props = {
    disabled?: boolean;
    iconAfter?: string;
    iconBefore?: string;
    isButton?: boolean;
    label?: string;
    optionStyles?: string;
    tight?: boolean;
    tooltipDirection?: string;
    tooltip?: string;
    value?: string;

    children?: any;

    onclick?: (value: string) => void;
    onauxclick?: (value: string) => void;
  };

  let {
    disabled = false,
    iconAfter = "",
    iconBefore = "",
    isButton = false,
    label = "",
    optionStyles = "",
    tight = true,
    tooltipDirection = "UP",
    tooltip = "",
    value = "",

    children,

    onclick = () => {},
    onauxclick = () => {},
  }: Props = $props();

  let style = $derived(`${optionStyles}`);
</script>

<li class="a5e-pill__wrapper">
  <button
    class="a5e-pill"
    type="button"
    {style}
    class:a5e-pill--tight={tight}
    class:a5e-pill--is-button={isButton}
    {disabled}
    {value}
    data-tooltip={tooltip}
    data-tooltip-direction={tooltipDirection}
    data-value={value}
    data-label={label || value}
    onpointerdown={(e) => {
      e.preventDefault();
      if (disabled) return;
      if (e.button === 0) onclick(value);
    }}
    onauxclick={(e) => {
      e.preventDefault();
      if (disabled) return;
      onauxclick(value);
    }}
  >
    {#if children}
      {@render children?.()}
    {:else}
      {#if iconBefore}
        <i class="{iconBefore} a5e-pill__icon" aria-hidden="true"></i>
      {/if}

      {_loc(label || value)}

      {#if iconAfter}
        <i class="{iconAfter} a5e-pill__icon" aria-hidden="true"></i>
      {/if}
    {/if}
  </button>
</li>

<style lang="scss">
  .a5e-pill {
    box-sizing: border-box !important;
    all: unset;
    display: inline;
    padding: 0.15rem 0.4rem;
    background: var(--a5e-pill-background-color);
    color: var(--a5e-pill-color, inherit);
    border: 1px solid var(--a5e-pill-border-color) !important;
    border-radius: 2px;
    transition: var(--a5e-transition-standard);
    white-space: normal;
    width: var(--a5e-pill-width, auto);

    &--is-button {
      cursor: pointer;

      &:hover,
      &:focus {
        background: var(--a5e-pill-background-color-hover);
        color: var(--a5e-pill-color-hover);
      }

      &:disabled,
      &[disabled] {
        cursor: auto;
      }
    }

    &__icon {
      padding-inline: 0.15rem;
      font-size: 0.85rem;
    }

    &--tight {
      padding: 0.1rem 0.375rem;
    }

    &__wrapper {
      margin: 0;
      list-style: none;
    }
  }
</style>
