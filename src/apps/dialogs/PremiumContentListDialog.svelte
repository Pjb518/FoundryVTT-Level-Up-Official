<script>
    import NavigationBar from "../components/navigation/NavigationBar.svelte";
    import PremiumContentListIntroduction from "./PremiumContentListIntroduction.svelte";
    import PremiumContentListPatreon from "./PremiumContentListPatreon.svelte";
    import PremiumContentListPremium from "./PremiumContentListPremium.svelte";

    function getCurrentTabComponent({ name }) {
        switch (name) {
            case "intro":
                return PremiumContentListIntroduction;
            case "premiumContent":
                return PremiumContentListPremium;
            case "patreon":
                return PremiumContentListPatreon;
            default:
                return PremiumContentListIntroduction;
        }
    }

    const tabs = [
        { name: "intro", label: "Introduction" },
        { name: "premiumContent", label: "Premium Content" },
        { name: "patreon", label: "Patreon Exclusive" },
    ];

    let currentTab = tabs[0];
</script>

<NavigationBar
    {currentTab}
    {tabs}
    on:tab-change={({ detail }) => (currentTab = tabs[detail])}
/>

<article>
    <svelte:component
        this={getCurrentTabComponent(currentTab)}
        on:change-tab={({ detail }) => (currentTab = tabs[detail])}
    />
</article>

<style lang="scss">
    :global(.a5e-premium-content-list-dialog) {
        min-width: 400px;
        min-height: 500px;
        max-height: 80vh;
    }

    :global(.a5e-premium-content-list-dialog .window-content) {
        padding: 0.5rem;
    }

    article {
        height: 100%;
        padding-inline: 0.25rem;
        overflow: auto;
    }
</style>
