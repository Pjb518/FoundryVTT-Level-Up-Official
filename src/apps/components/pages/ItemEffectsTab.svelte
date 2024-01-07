<script>
    import { getContext } from "svelte";

    import CreateMenu from "../actorUtilityBar/CreateMenu.svelte";
    import EffectCategory from "../EffectCategory.svelte";
    import Search from "../actorUtilityBar/Search.svelte";
    import Sort from "../actorUtilityBar/Sort.svelte";
    import UtilityBar from "../actorUtilityBar/UtilityBar.svelte";

    const item = getContext("item");
    const { activeEffects } = item;
    const subTypes = CONFIG.A5E.itemActiveEffectTypesPlural;
    const reducerType = "activeEffects";
</script>

{#if $item.isOwner}
    <UtilityBar>
        <Search {reducerType} />
        <Sort {reducerType} documentName="ActiveEffect" />
        <CreateMenu
            {reducerType}
            documentName="ActiveEffect"
            options={{ effectType: "passive" }}
        />
    </UtilityBar>
{/if}

<section class="a5e-page-wrapper a5e-page-wrapper--scrollable">
    {#each Object.entries($activeEffects._types) as [label, effects]}
        {#if effects.length && label !== "onUse"}
            <EffectCategory label={subTypes[label]} {effects} />
        {/if}
    {/each}
</section>
