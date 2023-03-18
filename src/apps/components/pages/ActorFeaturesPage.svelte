<script>
    import { getContext } from "svelte";

    import ItemCategory from "../ItemCategory.svelte";
    import SortFilter from "../SortFilter.svelte";

    const actor = getContext("actor");
    const { features } = actor;
</script>

<div class="features-page">
    {#if $actor.isOwner}
        <SortFilter itemType="features" />
    {/if}

    <section class="features-main-container">
        {#if $actor.type === "npc"}
            <ItemCategory label="" items={$features} type="featureTypes" />
        {:else}
            {#each Object.entries($features._types) as [label, items]}
                {#if items.length}
                    <ItemCategory {label} {items} type="featureTypes" />
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
