<script>
  import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

  export let heading = null;
  export let hint = null;
  export let inline = false;
</script>

<div
  class="a5e-box u-flex u-flex-wrap u-gap-md u-p-md"
  class:u-align-center={inline}
>
  {#if heading}
    <h3 class="u-flex-shrink-0 u-text-bold u-text-sm" class:u-w-30={inline}>
      {localize(heading)}
    </h3>

    <slot />

    {#if hint}
      <small>{localize(hint)}</small>
    {/if}
  {/if}
</div>
