<script>
    import { getContext, onDestroy } from "svelte";

    import GenericActorResource from "../GenericActorResource.svelte";
    import ItemCategory from "../ItemCategory.svelte";
    import ActorSkillsPage from "./ActorSkillsPage.svelte";

    import usesRequired from "../../../utils/usesRequired";
    import quantityRequired from "../../../utils/quantityRequired";

    export let resources;

    const actor = getContext("actor");
    const { favorites } = actor;

    let showQuantity = quantityRequired($favorites);
    let showUses = usesRequired($favorites);

    $: resources = $actor.system.resources;
    $: flags = $actor.flags;

    const unsubscribe = favorites.subscribe((_) => {
        showQuantity = quantityRequired($favorites);
        showUses = usesRequired($favorites);
    });

    onDestroy(() => {
        unsubscribe();
    });
</script>

{#if !(flags.a5e?.hideGenericResources ?? $actor.type === "npc")}
    <ol class="resources-container">
        {#each Object.entries(resources) as [source, resource]}
            <GenericActorResource {resource} {source} />
        {/each}
    </ol>
{/if}

{#if flags.a5e?.showFavoritesSection ?? true}
    <section class="a5e-page-wrapper a5e-page-wrapper--item-list">
        <ItemCategory
            label="A5E.FavoriteItems"
            icon="fas fa-star a5e-section-header__icon"
            items={[...$favorites].sort((a, b) => a.sort - b.sort)}
            type="favorites"
            {showQuantity}
            {showUses}
        />
    </section>
{:else}
    <ActorSkillsPage />
{/if}

<style lang="scss">
    .resources-container {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0.5rem;
        width: 100%;
        align-items: center;
        margin: 0;
        padding: 0;
        list-style: none;
    }
</style>
