<script>
    import { localize } from "#utils/localization/localize.ts";
    import { getContext, onDestroy } from "svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import CreateMenu from "../actorUtilityBar/CreateMenu.svelte";
    import Filter from "../actorUtilityBar/Filter.svelte";
    import ItemCategory from "../ItemCategory.svelte";
    import Search from "../actorUtilityBar/Search.svelte";
    import ShowDescription from "../actorUtilityBar/ShowDescription.svelte";
    import Sort from "../actorUtilityBar/Sort.svelte";
    import TabFooter from "../TabFooter.svelte";
    import UtilityBar from "../actorUtilityBar/UtilityBar.svelte";

    import usesRequired from "../../../utils/usesRequired";

    const actor = getContext("actor");
    const { features } = actor;
    const { A5E } = CONFIG;

    const reducerType = "features";
    const subTypes = A5E.featureTypes;
    const sortMap = CONFIG.A5E.reducerSortMap.features;

    const showFavorPoints =
        game.settings.get("a5e", "showFavorPoints") ?? false;

    let showDescription = false;
    let showUses = usesRequired(features);

    $: favorPoints = $actor.system.attributes.favorPoints;
    $: menuList = Object.entries(subTypes);
    $: sortedFeatures = Object.entries($features._types).sort(
        (a, b) => sortMap[a[0]] - sortMap[b[0]],
    );

    const unsubscribe = features.subscribe((_) => {
        showUses = usesRequired(features);
    });

    onDestroy(() => {
        unsubscribe();
    });
</script>

{#if $actor.isOwner}
    <UtilityBar>
        <Search {reducerType} />
        <ShowDescription
            on:updateSelection={() => (showDescription = !showDescription)}
        />
        <Sort {reducerType} />
        <Filter {reducerType} />
        <CreateMenu {reducerType} {menuList} />
    </UtilityBar>
{/if}

<section class="a5e-page-wrapper a5e-page-wrapper--item-list">
    {#if $actor.type === "npc"}
        <ItemCategory
            {showDescription}
            label=""
            items={$features}
            {showUses}
            type="featureTypes"
        />
    {:else}
        {#each sortedFeatures as [label, items]}
            {#if items.length}
                <ItemCategory
                    {label}
                    {items}
                    {showDescription}
                    {showUses}
                    type="featureTypes"
                />
            {/if}
        {/each}
    {/if}
</section>

<TabFooter --padding-right="1rem">
    {#if $actor.type === "character" && showFavorPoints}
        <div class="u-flex u-flex-wrap u-align-center u-gap-md">
            <h3 class="u-mb-0 u-text-sm u-text-bold">
                {localize("A5E.consumers.favorPoints")}
            </h3>

            <input
                class="a5e-footer-group__input"
                class:disable-pointer-events={!$actor.isOwner}
                type="number"
                name="system.attributes.favorPoints.current"
                value={favorPoints.current}
                placeholder="0"
                min="0"
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        Number(target.value),
                    )}
            />

            /

            <span class="a5e-footer-group__value">
                {favorPoints.max}
            </span>
        </div>
    {/if}
</TabFooter>

<style lang="scss">
    .disable-pointer-events {
        pointer-events: none;
    }
</style>
