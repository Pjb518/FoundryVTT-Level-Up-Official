<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import ActivationCost from "./summarySections/ActivationCost.svelte";
    import Area from "./summarySections/Area.svelte";
    import Duration from "./summarySections/Duration.svelte";
    import Range from "./summarySections/Range.svelte";
    import Targets from "./summarySections/Targets.svelte";

    export let actionId = "";
    export let item;

    function prepareObjectProperties(item) {
        const { objectType } = item.system;
        const properties = prepareMaterialProperties(item);

        if (objectType === "armor") {
            properties.push(
                ...item.system.armorProperties.map(
                    (property) => armorProperties[property] ?? property
                )
            );
        } else if (objectType === "shield") {
            properties.push(
                ...item.system.shieldProperties.map(
                    (property) => shieldProperties[property] ?? property
                )
            );
        } else if (objectType === "weapon") {
            properties.push(
                ...item.system.weaponProperties.map(
                    (property) => weaponProperties[property] ?? property
                )
            );
        }

        properties.sort((a, b) => a.localeCompare(b));

        return properties.join(", ");
    }

    function prepareMaterialProperties(item) {
        if (!item.system.materialProperties) return [];

        return item.system.materialProperties.map((property) =>
            localize(materialProperties[property] ?? property)
        );
    }

    const {
        armorProperties,
        materialProperties,
        shieldProperties,
        weaponProperties,
    } = CONFIG.A5E;

    $: objectProperties = prepareObjectProperties(item);

    let listHeight;
</script>

{#if !actionId && objectProperties}
    <p class="object-properties">{objectProperties}</p>
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
