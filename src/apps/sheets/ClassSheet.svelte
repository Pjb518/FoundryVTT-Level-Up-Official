<svelte:options accessors={true} />

<script>
    import { getContext, setContext } from "svelte";

    import ClassPropertiesTab from "../components/pages/ClassPropertiesTab.svelte";
    import ClassResourcesTab from "../components/pages/ClassResourcesTab.svelte";
    import ItemDescriptionTab from "../components/pages/ItemDescriptionTab.svelte";
    import ItemGrantsTab from "../components/pages/ItemGrantsTab.svelte";
    import ItemSheetHeader from "../components/itemSheetsHeader/ItemSheetHeader.svelte";
    import NavigationBar from "../components/navigation/NavigationBar.svelte";

    export let document;
    export let sheet;

    const item = document;

    function updateCurrentTab(event) {
        currentTab = tabs[event.detail];
    }

    // **********************************************
    // Drag Drop Handlers
    function onDrop(event) {
        const transferData = event.dataTransfer.getData("text/plain");
        if (!transferData) return;

        const dragData = JSON.parse(transferData);
        sheet._onDropDocument(dragData);
    }

    const tabs = [
        {
            name: "description",
            label: "A5E.tabs.description",
            component: ItemDescriptionTab,
        },
        {
            name: "properties",
            label: "A5E.tabs.properties",
            component: ClassPropertiesTab,
        },
        {
            name: "resources",
            label: "A5E.tabs.resources",
            component: ClassResourcesTab,
        },
        {
            name: "grants",
            label: "A5E.tabs.grants",
            component: ItemGrantsTab,
        },
    ];

    let currentTab = tabs[0];

    setContext("item", item);
</script>

<main on:drop|preventDefault|stopPropagation={(event) => onDrop(event)}>
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
