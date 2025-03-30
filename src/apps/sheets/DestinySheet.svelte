<svelte:options accessors={true} />

<script>
    import { getContext, setContext } from "svelte";

    import DestinyFeaturesTab from "../components/pages/DestinyFeaturesTab.svelte";
    import ItemDescriptionTab from "../components/pages/ItemDescriptionTab.svelte";
    import ItemSheetHeader from "../components/itemSheetsHeader/ItemSheetHeader.svelte";
    import NavigationBar from "../components/navigation/NavigationBar.svelte";

    export let document;

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
            name: "features",
            label: "A5E.TabFeatures",
            component: DestinyFeaturesTab,
        },
    ];

    let currentTab = tabs[0];

    setContext("item", item);
</script>

<main>
    <ItemSheetHeader />

    <NavigationBar {currentTab} {tabs} on:tab-change={updateCurrentTab} />

    <svelte:component this={currentTab.component} />
</main>

<style lang="scss">
    main {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 0.75rem;
        gap: 0.5rem;
    }
</style>
