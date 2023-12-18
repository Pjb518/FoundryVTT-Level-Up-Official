<script>
    import { fade } from "svelte/transition";

    import CompendiumManeuverFilters from "../CompendiumManeuverFilters.svelte";
    import CompendiumMonsterFilters from "../CompendiumMonsterFilters.svelte";
    import CompendiumObjectFilters from "../CompendiumObjectFilters.svelte";
    import CompendiumSpellFilters from "../CompendiumSpellFilters.svelte";

    export let compendiumType;

    const compendiumItemComponents = {
        "5eSpell": CompendiumSpellFilters,
        object: CompendiumObjectFilters,
        magicItem: CompendiumObjectFilters,
        maneuver: CompendiumManeuverFilters,
        monster: CompendiumMonsterFilters,
        spell: CompendiumSpellFilters,
    };
</script>

<section class="filter-page" transition:fade>
    <svelte:component
        this={compendiumItemComponents[compendiumType]}
        {compendiumType}
    />
</section>

<style lang="scss">
    .filter-page {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        grid-area: main;
        overflow-y: auto;
    }
</style>
