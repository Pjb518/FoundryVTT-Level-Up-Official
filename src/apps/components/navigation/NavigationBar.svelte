<script>
    import NavigationItem from "./NavigationItem.svelte";

    export let currentTab;
    export let tabs;
</script>

<nav class="nav-wrapper">
    <ul class="nav-list">
        {#each tabs as tab, index}
            <NavigationItem on:tab-change {tab} {index} {currentTab} />
        {/each}
    </ul>
</nav>

<style lang="scss">
    .nav-wrapper {
        margin: 0.25rem 0;
        padding: 0.375rem 0.75rem;
        background: #2b6537;
        color: #f6f2eb;
        font-family: "Modesto Condensed", serif;
        font-size: 1rem;
        border-radius: 3px;
        text-transform: lowercase;
        box-shadow: 0 0 10px darken($color: #2b6537, $amount: 10) inset;
    }

    .nav-list {
        display: flex;
        gap: 0.5rem;
        margin: 0;
        padding: 0;
        list-style: none;
    }
</style>
