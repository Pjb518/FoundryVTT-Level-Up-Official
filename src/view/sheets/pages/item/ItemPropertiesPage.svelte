<script lang="ts">
    import { getContext } from "svelte";

    import AmmunitionConfiguration from "../../components/item/AmmunitionConfiguration.svelte";
    import ArmorClassConfiguration from "../../components/item/ArmorClassConfiguration.svelte";
    import ArmorConfiguration from "../../components/item/ArmorConfiguration.svelte";
    import ContainerConfiguration from "../../components/item/ContainerConfiguration.svelte";
    import FeatureConfiguration from "../../components/item/FeatureConfiguration.svelte";
    import ManeuverConfiguration from "../../components/item/ManeuverConfiguration.svelte";
    import MaterialConfiguration from "../../components/item/MaterialConfiguration.svelte";
    import ObjectConfiguration from "../../components/item/ObjectConfiguration.svelte";
    import ShieldConfiguration from "../../components/item/ShieldConfiguration.svelte";
    import SpellConfiguration from "../../components/item/SpellConfiguration.svelte";
    import WeaponConfiguration from "../../components/item/WeaponConfiguration.svelte";
    import UsesConfiguration from "../../components/item/UsesConfiguration.svelte";

    let item: any = getContext("item");
    let itemStore = $derived(item.reactive.system);
</script>

<section class="a5e-page-wrapper a5e-page-wrapper--scrollable">
    {#if item.type === "feature"}
        <FeatureConfiguration />
        <ArmorClassConfiguration />
    {:else if item.type === "maneuver"}
        <ManeuverConfiguration />
    {:else if item.type === "object"}
        <ObjectConfiguration />
        <MaterialConfiguration />
        {#if itemStore.objectType === "ammunition"}
            <AmmunitionConfiguration />
        {:else if itemStore.objectType === "armor"}
            <ArmorConfiguration />
        {:else if itemStore.objectType === "container"}
            <ContainerConfiguration />
        {:else if itemStore.objectType === "shield"}
            <ShieldConfiguration />
        {:else if itemStore.objectType === "weapon"}
            <WeaponConfiguration />
        {/if}
        <ArmorClassConfiguration />
    {:else if item.type === "spell"}
        <SpellConfiguration />
    {/if}

    <UsesConfiguration />
</section>
