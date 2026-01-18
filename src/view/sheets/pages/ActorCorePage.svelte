<script>
    import { getContext } from "svelte";

    import GenericActorResource from "#view/sheets/components/actor/GenericActorResource.svelte";

    import ItemCategory from "#view/sheets/components/ItemCategory.svelte";
    import ActorSkillsPage from "./ActorSkillsPage.svelte";

    import { usesRequired } from "#utils/view/usesRequired.ts";
    import { quantityRequired } from "#utils/view/quantityRequired.ts";

    let { resources = $bindable() } = $props();

    const actor = getContext("actor");

    let actorResources = $derived(actor.reactive.system.resources);
    let flags = $derived(actor.reactive.flags);
    let favoritesList = $derived(
        actor.reactive.items.filter((item) => item.system.favorite === true),
    );

    let showQuantity = $derived(quantityRequired(favoritesList));
    let showUses = $derived(usesRequired(favoritesList));

    // Update resources reactively
    $effect(() => {
        resources = actorResources;
    });
</script>

{#if !(flags.a5e?.hideGenericResources ?? actor.type === "npc")}
    <div class="a5e-resources-wrapper">
        <ol class="a5e-resources-container">
            {#each Object.entries(actorResources) as [source, resource]}
                <GenericActorResource {resource} {source} />
            {/each}
        </ol>
    </div>
{/if}

{#if flags.a5e?.showFavoritesSection ?? true}
    <section class="a5e-page-wrapper a5e-page-wrapper--item-list">
        <ItemCategory
            label="A5E.tabs.favoriteItems"
            icon="fas fa-star a5e-section-header__icon"
            items={[...favoritesList].sort((a, b) => a.sort - b.sort)}
            type="favorites"
            {showQuantity}
            {showUses}
        />
    </section>
{:else}
    <ActorSkillsPage />
{/if}
