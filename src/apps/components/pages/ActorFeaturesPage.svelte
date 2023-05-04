<script>
    import { getContext } from "svelte";

    import ItemCategory from "../ItemCategory.svelte";
    import SortFilter from "../SortFilter.svelte";

    import usesRequired from "../../../utils/usesRequired";

    const actor = getContext("actor");
    const { features } = actor;
    const { A5E } = CONFIG;

    const subTypes = A5E.featureTypes;
    const sortMap = CONFIG.A5E.reducerSortMap.features;

    $: sortedFeatures = Object.entries($features._types).sort(
        (a, b) => sortMap[a[0]] - sortMap[b[0]]
    );
</script>

<div class="features-page">
    {#if $actor.isOwner}
        <SortFilter itemType="features" {subTypes} />
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
