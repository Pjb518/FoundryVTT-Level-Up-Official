<script>
    import { getContext, onDestroy } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import CreateMenu from "../actorUtilityBar/CreateMenu.svelte";
    import EffectCategory from "../EffectCategory.svelte";
    import Search from "../actorUtilityBar/Search.svelte";
    import Sort from "../actorUtilityBar/Sort.svelte";
    import UtilityBar from "../actorUtilityBar/UtilityBar.svelte";

    import ActionsManager from "../../../managers/ActionsManager";

    const item = getContext("item");
    const actionId = getContext("actionId");
    const { activeEffects } = item;
    const subTypes = CONFIG.A5E.actionActiveEffectTypesPlural;
    const reducerType = "activeEffects";

    let actionIds = new Set($item.actions.keys());
    activeEffects.filters.add({
        id: "onUse-filter",
        filter: (effect) =>
            effect.flags?.a5e?.actionId === actionId ||
            !actionIds.has(effect.flags?.a5e?.actionId),
    });

    onDestroy(() => {
        activeEffects.filters.clear();
    });
</script>

<div class="effects-page">
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

    <section class="effects-main-container">
        {#each Object.entries($activeEffects._types) as [label, effects]}
            {#if effects.length && label === "onUse"}
                <EffectCategory label={subTypes[label]} {effects} />
            {/if}
        {/each}
    </section>
</div>

<style lang="scss">
    .effects-page {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 0.5rem;
        overflow: hidden;
    }

    .effects-main-container {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        gap: 0.75rem;
        overflow-y: auto;
        overflow-x: hidden;
    }
</style>
