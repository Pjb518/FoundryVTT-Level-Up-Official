<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import ActivationCost from "./summarySections/ActivationCost.svelte";
    import Area from "./summarySections/Area.svelte";
    import Duration from "./summarySections/Duration.svelte";
    import Range from "./summarySections/Range.svelte";
    import Targets from "./summarySections/Targets.svelte";

    export let actionId = "";
    export let item;

    function prepareArmorProperties(item) {
        const properties = [];

        if (item.system.armorProperties) {
            properties.push(
                ...item.system.armorProperties.map((property) =>
                    localize(armorProperties[property] ?? property)
                )
            );
        }

        properties.push(...prepareMaterialProperties(item));
        properties.sort((a, b) => a.localeCompare(b));

        return properties.join(", ");
    }

    function prepareMaterialProperties(item) {
        if (!item.system.materialProperties) return [];

        return item.system.materialProperties.map((property) =>
            localize(materialProperties[property] ?? property)
        );
    }

    function prepareWeaponProperties(item) {
        const properties = [];

        if (item.system.weaponProperties) {
            properties.push(
                ...item.system.weaponProperties.map((property) =>
                    localize(weaponProperties[property] ?? property)
                )
            );
        }

        properties.push(...prepareMaterialProperties(item));
        properties.sort((a, b) => a.localeCompare(b));

        return properties.join(", ");
    }

    const { armorProperties, materialProperties, weaponProperties } =
        CONFIG.A5E;

    $: armorPropertyList = prepareArmorProperties(item);
    $: weaponPropertyList = prepareWeaponProperties(item);

    let listHeight;
</script>

{#if !actionId}
    {#if item.system.objectType === "armor" && armorPropertyList.length}
        <p class="object-properties">{armorPropertyList}</p>
    {:else if item.system.objectType === "weapon" && weaponPropertyList.length}
        <p class="object-properties">{weaponPropertyList}</p>
    {/if}
{/if}

<dl
    bind:clientHeight={listHeight}
    class="summary-list"
    class:hide={listHeight === 0}
>
    <ActivationCost {actionId} {item} />
    <Range {actionId} {item} />
    <Targets {actionId} {item} />
    <Area {actionId} {item} />
    <Duration {actionId} {item} />

    {#if !actionId && item.system.craftingComponents}
        <div class="summary-group">
            <dt>{localize("A5E.CraftingComponents")}:</dt>
            <dd>{item.system.craftingComponents}</dd>
        </div>
    {/if}
</dl>

<style lang="scss">
    dd {
        margin: 0;
        padding: 0;
    }

    .object-properties {
        font-style: italic;
        margin-bottom: 0.5rem;
    }

    .summary-list {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        margin: 0 0 0.5rem 0;
    }

    .summary-group {
        display: flex;
        align-items: flex-start;
        gap: 0.25rem;
    }

    .hide {
        display: none;
    }
</style>
