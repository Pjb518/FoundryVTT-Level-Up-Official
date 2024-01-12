<script>
    import SecondaryNavigationItem from "./SecondaryNavigationItem.svelte";

    export let currentTab;
    export let tabs;
</script>

<nav class="a5e-secondary-nav">
    <ul class="a5e-secondary-nav-list">
        {#each Object.entries(tabs) as [name, tab]}
            {#if tab?.display ?? true}
                <SecondaryNavigationItem
                    on:tab-change
                    {currentTab}
                    {name}
                    {tab}
                />
            {/if}
        {/each}
    </ul>
</nav>
