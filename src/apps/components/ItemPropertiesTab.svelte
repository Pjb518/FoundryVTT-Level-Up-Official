<script>
  import { getContext } from "svelte";
  import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

  import FeatureConfiguration from "./itemPropertiesConfig/FeatureConfiguration.svelte";
  import ManeuverConfiguration from "./itemPropertiesConfig/ManeuverConfiguration.svelte";
  import ObjectConfiguration from "./itemPropertiesConfig/ObjectConfiguration.svelte";

  const item = getContext("item");
</script>

<div class="u-flex u-flex-col u-gap-xl">
  {#if $item.type === "feature"}
    <FeatureConfiguration />
  {:else if $item.type === "maneuver"}
    <ManeuverConfiguration />
  {:else if $item.type === "object"}
    <ObjectConfiguration />
  {/if}
</div>

<style lang="scss">
</style>
