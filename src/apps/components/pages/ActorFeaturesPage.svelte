<script>
    import { getContext } from "svelte";

    import CreateMenu from "../actorUtilityBar/CreateMenu.svelte";
    import Filter from "../actorUtilityBar/Filter.svelte";
    import ItemCategory from "../ItemCategory.svelte";
    import Search from "../actorUtilityBar/Search.svelte";
    import Sort from "../actorUtilityBar/Sort.svelte";
    import UtilityBar from "../actorUtilityBar/UtilityBar.svelte";

    import usesRequired from "../../../utils/usesRequired";

    const actor = getContext("actor");
    const { features } = actor;
    const { A5E } = CONFIG;

    const reducerType = "features";
    const subTypes = A5E.featureTypes;
    const sortMap = CONFIG.A5E.reducerSortMap.features;

    $: menuList = Object.entries(subTypes);
    $: sortedFeatures = Object.entries($features._types).sort(
        (a, b) => sortMap[a[0]] - sortMap[b[0]]
    );
</script>

<div class="features-page">
    {#if $actor.isOwner}
        <UtilityBar>
            <Search {reducerType} />
            <Sort {reducerType} />
            <Filter {reducerType} />
            <CreateMenu {reducerType} {menuList} />
        </UtilityBar>
    {/if}

    <section class="features-main-container">
        {#if $actor.type === "npc"}
            <ItemCategory
                label=""
                items={$features}
                type="featureTypes"
                usesRequired={usesRequired($features)}
            />
        {:else}
            {#each sortedFeatures as [label, items]}
                {#if items.length}
                    <ItemCategory
                        {label}
                        {items}
                        type="featureTypes"
                        usesRequired={usesRequired($features)}
                    />
                {/if}
            {/each}
        {/if}
    </section>

    <footer class="features-footer" />
</div>

<style lang="scss">
    .features-page {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 0.5rem;
        overflow: hidden;
    }

    .features-main-container {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        gap: 0.75rem;
        overflow-y: auto;
        overflow-x: hidden;
    }
</style>
