<script>
    import CompendiumSpellFilters from "./CompendiumSpellFilters.svelte";

    export let compendiumType;

    const compendiumItemComponents = {
        spell: CompendiumSpellFilters,
    };
</script>

<section class="filter-sidebar">
    <svelte:component this={compendiumItemComponents[compendiumType]} />
</section>

<style lang="scss">
    .filter-sidebar {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        grid-area: filters;
        border-right: 1px solid #ccc;
        overflow-y: auto;
    }
</style>
