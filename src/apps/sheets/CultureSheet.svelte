<svelte:options accessors={true} />

<script>
    import { getContext, setContext } from "svelte";
    import { ApplicationShell } from "#runtime/svelte/component/core";

    import BackgroundCultureDetailsTab from "../components/pages/BackgroundCultureDetailsTab.svelte";
    import BackgroundCultureFeaturesTab from "../components/pages/BackgroundCultureFeaturesTab.svelte";
    import ItemDescriptionTab from "../components/pages/ItemDescriptionTab.svelte";
    import ItemSheetHeader from "../components/itemSheetsHeader/ItemSheetHeader.svelte";
    import NavigationBar from "../components/navigation/NavigationBar.svelte";

    export let { document } = getContext("#external").application;
    export let elementRoot;

    const item = document;

    function updateCurrentTab(event) {
        currentTab = tabs[event.detail];
    }

    const tabs = [
        {
            name: "description",
            label: "A5E.Description",
            component: ItemDescriptionTab,
        },
        {
            name: "details",
            label: "A5E.TabDetails",
            component: BackgroundCultureDetailsTab,
        },
        {
            name: "features",
            label: "A5E.TabFeatures",
            component: BackgroundCultureFeaturesTab,
        },
    ];

    let currentTab = tabs[0];

    setContext("item", item);
</script>

<ApplicationShell bind:elementRoot>
    <main>
        <ItemSheetHeader />

        <NavigationBar {currentTab} {tabs} on:tab-change={updateCurrentTab} />

        <svelte:component this={currentTab.component} />
    </main>
</ApplicationShell>

<style lang="scss">
    main {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 0.75rem;
        gap: 0.5rem;

        background: rgba(246, 242, 235, 0.5);
    }
</style>
