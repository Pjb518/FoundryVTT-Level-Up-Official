<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import ActivationCost from "./summarySections/ActivationCost.svelte";
    import Area from "./summarySections/Area.svelte";
    import Duration from "./summarySections/Duration.svelte";
    import Range from "./summarySections/Range.svelte";
    import Targets from "./summarySections/Targets.svelte";

    export let actionId = "";
    export let item;

    $: spellComponents = Object.entries(item.system.components).reduce(
        (acc, [component, hasComponent]) => {
            if (hasComponent)
                acc.push(
                    localize(CONFIG.A5E.spellComponentAbbreviations[component])
                );

            return acc;
        },
        []
    );

    $: spellSchools = [
        item.system.schools.primary,
        ...item.system.schools.secondary,
    ].filter(Boolean);

    let listHeight;
</script>

{#if !actionId}
    <p class="spell-level">
        {localize(`A5E.SpellLevel${item.system.level}` ?? "")}

        {#if spellSchools.length}
            ({spellSchools.join(", ")})
        {/if}
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

    {#if !actionId && spellComponents.length}
        <div class="summary-group">
            <dt>{localize("A5E.SpellComponents")}:</dt>
            <dd>
                {spellComponents.join(", ")}

                {#if item.system.components.material}
                    ({item.system.materials})
                {/if}
            </dd>
        </div>
    {/if}

    <Duration {actionId} {item} />
</dl>

<style lang="scss">
    dd {
        margin: 0;
        padding: 0;
    }

    .spell-level {
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
