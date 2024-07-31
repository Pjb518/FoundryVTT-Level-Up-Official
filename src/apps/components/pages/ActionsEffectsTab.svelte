<script lang="ts">
    import type { Writable } from "svelte/store";
    import type { ItemA5e } from "../../../documents/item/item";

    import { getContext, onDestroy } from "svelte";

    import CreateMenu from "../actorUtilityBar/CreateMenu.svelte";
    import EffectCategory from "../EffectCategory.svelte";
    import Search from "../actorUtilityBar/Search.svelte";
    import Sort from "../actorUtilityBar/Sort.svelte";
    import UtilityBar from "../actorUtilityBar/UtilityBar.svelte";

    const item: Writable<ItemA5e> = getContext("item");
    const actionId: string = getContext("actionId");
    const { activeEffects } = item;
    const subTypes = CONFIG.A5E.actionActiveEffectTypesPlural;
    const reducerType = "activeEffects";

    let actionIds = new Set($item.actions.keys());
    activeEffects?.filters.add({
        id: "onUse-filter",
        filter: (effect) => {
            return (
                effect.flags?.a5e?.actionId === actionId ||
                !actionIds.has(effect.flags?.a5e?.actionId)
            );
        },
    });

    onDestroy(() => {
        activeEffects?.filters.clear();
    });
</script>

{#if $item.isOwner}
    <UtilityBar>
        <Search {reducerType} />
        <Sort {reducerType} documentName="ActiveEffect" />
        <CreateMenu
            {reducerType}
            documentName="ActiveEffect"
            options={{ actionId, effectType: "onUse" }}
        />
    </UtilityBar>
{/if}

<section class="a5e-page-wrapper a5e-page-wrapper--scrollable">
    {#each Object.entries($activeEffects._types) as [label, effects]}
        {#if effects.length && label === "onUse"}
            <EffectCategory label={subTypes[label]} {effects} />
        {/if}
    {/each}
</section>
