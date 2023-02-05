<script>
    import { getContext } from "svelte";

    import ItemCategory from "../ItemCategory.svelte";
    import SortFilter from "../SortFilter.svelte";

    const actor = getContext("actor");
    const { features } = actor;
</script>

<div class="features-page">
    <SortFilter itemType="features" />

    <section class="features-main-container">
        {#each Object.entries($features._types) as [label, items]}
            {#if items.length}
                <ItemCategory {label} {items} type="featureTypes" />
            {/if}
        {/each}
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
    .search-container {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }

    .features-main-container {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        gap: 0.25rem;
        overflow-y: auto;
        overflow-x: hidden;
    }
</style>
