<svelte:options accessors={true} />

<script>
    import { getContext, setContext } from "svelte";
    import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    import DestinyFeaturesTab from "../components/pages/DestinyFeaturesTab.svelte";
    import ItemDescriptionTab from "../components/pages/ItemDescriptionTab.svelte";
    import ItemSheetHeader from "../components/itemSheetsHeader/ItemSheetHeader.svelte";
    import NavigationBar from "../components/navigation/NavigationBar.svelte";

    export let { itemDocument } = getContext("#external").application;
    export let elementRoot;

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

    $: currentTab = tabs[0];

    setContext("item", new TJSDocument(itemDocument));
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
