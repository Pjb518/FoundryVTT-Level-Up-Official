<script>
  import { getContext } from "svelte";

  import AmmunitionConfiguration from "../itemPropertiesConfig/AmmunitionConfiguration.svelte";
  import ArmorConfiguration from "../itemPropertiesConfig/ArmorConfiguration.svelte";
  import FeatureConfiguration from "../itemPropertiesConfig/FeatureConfiguration.svelte";
  import ManeuverConfiguration from "../itemPropertiesConfig/ManeuverConfiguration.svelte";
  import MaterialConfiguration from "../itemPropertiesConfig/MaterialConfiguration.svelte";
  import ObjectConfiguration from "../itemPropertiesConfig/ObjectConfiguration.svelte";
  import ResourceConfiguration from "../itemPropertiesConfig/ResourceConfiguration.svelte";
  import SpellConfiguration from "../itemPropertiesConfig/SpellConfiguration.svelte";
  import WeaponConfiguration from "../itemPropertiesConfig/WeaponConfiguration.svelte";

  const item = getContext("item");
</script>

<div class="u-flex u-flex-col u-gap-xl properties__container">
  {#if $item.type === "feature"}
    <FeatureConfiguration />
  {:else if $item.type === "maneuver"}
    <ManeuverConfiguration />
  {:else if $item.type === "object"}
    <ObjectConfiguration />
    <MaterialConfiguration />
    {#if $item.system.objectType === "ammunition"}
      <AmmunitionConfiguration />
    {:else if $item.system.objectType === "armor"}
      <ArmorConfiguration />
    {:else if $item.system.objectType === "weapon"}
      <WeaponConfiguration />
    {/if}
  {:else if $item.type === "spell"}
    <SpellConfiguration />
  {/if}

  <ResourceConfiguration />
</div>

<style lang="scss">
  .properties__container {
    overflow-y: auto;
  }
</style>
