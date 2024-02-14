<svelte:options accessors={true} />

<script>
    import { getContext, setContext } from "svelte";
    import { ApplicationShell } from "#runtime/svelte/component/core";

    import HeritageDetailsTab from "../components/pages/HeritageDetailsTab.svelte";
    import HeritageFeaturesTab from "../components/pages/HeritageFeaturesTab.svelte";
    import HeritageGiftsTab from "../components/pages/HeritageGiftsTab.svelte";
    import HeritageParagonGiftsTab from "../components/pages/HeritageParagonGiftsTab.svelte";
    import ItemDescriptionTab from "../components/pages/ItemDescriptionTab.svelte";
    import ItemGrantsTab from "../components/pages/ItemGrantsTab.svelte";
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
            name: "grants",
            label: "A5E.TabGrants",
            component: ItemGrantsTab,
        },
        {
            name: "details",
            label: "A5E.TabDetails",
            component: HeritageDetailsTab,
        },
        {
            name: "features",
            label: "A5E.TabTraits",
            component: HeritageFeaturesTab,
        },
        {
            name: "gifts",
            label: "A5E.TabGifts",
            component: HeritageGiftsTab,
        },
        {
            name: "paragonGifts",
            label: "A5E.TabParagonGifts",
            component: HeritageParagonGiftsTab,
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
    }
</style>
