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

{#if $actor.isOwner}
    <UtilityBar>
        <Search {reducerType} />
        <Sort {reducerType} documentName="ActiveEffect" />
        <CreateMenu {reducerType} documentName="ActiveEffect" />
    </UtilityBar>
{/if}

<section class="a5e-page-wrapper a5e-page-wrapper--item-list">
    {#each Object.entries($activeEffects._types) as [label, effects]}
        {#if effects.length}
            <EffectCategory label={subTypes[label]} {effects} />
        {/if}
    {/each}
</section>
