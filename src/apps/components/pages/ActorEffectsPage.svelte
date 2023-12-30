<script>
    import { getContext } from "svelte";

    import CreateMenu from "../actorUtilityBar/CreateMenu.svelte";
    import EffectCategory from "../EffectCategory.svelte";
    import Search from "../actorUtilityBar/Search.svelte";
    import Sort from "../actorUtilityBar/Sort.svelte";
    import UtilityBar from "../actorUtilityBar/UtilityBar.svelte";

    const actor = getContext("actor");
    const { activeEffects } = actor;
    const { A5E, statusEffects } = CONFIG;
    const subTypes = A5E.activeEffectTypes;
    const reducerType = "activeEffects";
</script>

<div class="effects-page">
    {#if $actor.isOwner}
        <UtilityBar>
            <Search {reducerType} />
            <Sort {reducerType} documentName="ActiveEffect" />
            <CreateMenu {reducerType} documentName="ActiveEffect" />
        </UtilityBar>
    {/if}

    <section class="effects-main-container">
        {#each Object.entries($activeEffects._types) as [label, effects]}
            {#if effects.length}
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
