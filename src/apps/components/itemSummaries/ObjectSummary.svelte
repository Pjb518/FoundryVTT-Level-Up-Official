<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import ActivationCost from "./summarySections/ActivationCost.svelte";
    import Area from "./summarySections/Area.svelte";
    import Duration from "./summarySections/Duration.svelte";
    import Range from "./summarySections/Range.svelte";
    import Targets from "./summarySections/Targets.svelte";

    export let actionId = "";
    export let item;

    const { weaponProperties } = CONFIG.A5E;
    let listHeight;
</script>

{#if !actionId && item.system.objectType === "weapon" && item.system.weaponProperties.length}
    <p class="object-properties">
        {item.system.weaponProperties
            .map((property) => localize(weaponProperties[property] ?? property))
            .join(", ")}
    </p>
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
