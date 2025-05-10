<script lang="ts">
    import type { Tab } from "./data.ts";

    import SecondaryNavigationItem from "./SecondaryNavigationItem.svelte";

    type Props = {
        currentTab: string;
        tabs: Tab[];
        onTabChange: (tabId: string) => void;
    };

    let { currentTab, tabs, onTabChange }: Props = $props();
</script>

<nav class="a5e-secondary-nav">
    <ul class="a5e-secondary-nav-list">
        {#each tabs as tab}
            {#if tab?.display ?? true}
                <SecondaryNavigationItem
                    {currentTab}
                    name={tab.name}
                    {tab}
                    {onTabChange}
                />
            {/if}
        {/each}
    </ul>
</nav>
