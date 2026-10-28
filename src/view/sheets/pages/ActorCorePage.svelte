<script>
    import { getContext } from "svelte";
    import { quantityRequired } from "#utils/view/quantityRequired.ts";
    import { usesRequired } from "#utils/view/usesRequired.ts";
    import GenericActorResources from "#view/sheets/components/actor/GenericActorResource.svelte";
    import ItemCategory from "#view/sheets/components/ItemCategory.svelte";
    import Section from "#view/snippets/Section.svelte";
    import ActorSkillsPage from "./ActorSkillsPage.svelte";

    const actor = getContext("actor");

    let flags = $derived(actor.reactive.flags);
    let favoritesList = $derived(
        actor.reactive.items.filter((item) => item.system.favorite === true),
    );

    let showQuantity = $derived(quantityRequired(favoritesList));
    let showUses = $derived(usesRequired(favoritesList));
</script>

<section class="a5e-page-wrapper a5e-page-wrapper--item-list">
    {#if !(flags.a5e?.hideGenericResources ?? actor.type === "npc")}
        <div class="a5e-resources-wrapper">
            <Section
                heading="Resources"
                headerButtons={[
                    {
                        htmlString: '<i class="fa-solid fa-plus"></i>',
                        tooltip: "Add Resource",
                        handler: () =>
                            actor.update({
                                "system.resources.new-resource": {
                                    type: "uses",
                                    slug: "new-resource",
                                },
                            }),
                    },
                ]}
            >
                <GenericActorResources />
            </Section>
        </div>
    {/if}

    {#if flags.a5e?.showFavoritesSection ?? true}
        <ItemCategory
            label="A5E.tabs.favoriteItems"
            icon="fas fa-star a5e-section-header__icon"
            items={[...favoritesList].sort((a, b) => a.sort - b.sort)}
            type="favorites"
            {showQuantity}
            {showUses}
        />
    {:else}
        <ActorSkillsPage />
    {/if}
</section>
