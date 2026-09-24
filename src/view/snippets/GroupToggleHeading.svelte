<script lang="ts">
  import { localize } from "#utils/localization/localize.ts";

  import type { GroupSelectionState, GroupTriState } from "#utils/prepareProductSourceTree.ts";

  type Props = {
    label: string;
    variant: "publisher" | "productLine";
    state: GroupSelectionState | GroupTriState;
    onToggle: () => void;
  };

  let { label, variant, state, onToggle }: Props = $props();

  const ACTIVE_STATES = ["all", "inclusive"];
  const MIXED_STATES = ["some", "mixed"];

  function iconFor(groupState: GroupSelectionState | GroupTriState): string {
    if (ACTIVE_STATES.includes(groupState)) return "fa-solid fa-square-check";
    if (groupState === "exclusive") return "fa-solid fa-square-xmark";
    if (MIXED_STATES.includes(groupState)) return "fa-solid fa-square-minus";
    return "fa-regular fa-square";
  }

  function ariaPressedFor(groupState: GroupSelectionState | GroupTriState): string {
    if (ACTIVE_STATES.includes(groupState) || groupState === "exclusive") return "true";
    if (MIXED_STATES.includes(groupState)) return "mixed";
    return "false";
  }
</script>

<button
  type="button"
  class="a5e-group-toggle-heading a5e-group-toggle-heading--{variant}"
  class:a5e-group-toggle-heading--active={ACTIVE_STATES.includes(state)}
  class:a5e-group-toggle-heading--exclusive={state === "exclusive"}
  aria-pressed={ariaPressedFor(state)}
  onclick={(e) => {
    e.preventDefault();
    onToggle();
  }}
>
  <i class={iconFor(state)} aria-hidden="true"></i>
  {localize(label)}
</button>

<style lang="scss">
  .a5e-group-toggle-heading {
    all: unset;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    width: fit-content;
    cursor: pointer;
    font-weight: bold;
    color: var(--a5e-color-text-dark, inherit);

    &:hover,
    &:focus {
      color: var(--a5e-color-primary);
    }

    &--active {
      color: var(--a5e-color-primary);
    }

    &--exclusive {
      color: var(--a5e-color-error);
    }

    &--publisher {
      font-size: var(--a5e-sm-text);
    }

    &--productLine {
      font-size: var(--a5e-xs-text);
      margin-left: 0.5rem;
    }
  }
</style>
