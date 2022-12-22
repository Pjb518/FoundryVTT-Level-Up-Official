<script>
  import { getContext } from "svelte";
  import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

  import FeatureConfiguration from "./itemPropertiesConfig/FeatureConfiguration.svelte";

  const item = getContext("item");
</script>

<div class="u-flex u-flex-col u-gap-xl">
  {#if $item.type === "feature"}
    <FeatureConfiguration />
  {/if}
</div>

<style lang="scss">
</style>
