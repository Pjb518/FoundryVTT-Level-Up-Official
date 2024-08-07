<svelte:options accessors={true} />

<script>
    import { getContext, setContext } from "svelte";
    import { ApplicationShell } from "#runtime/svelte/component/core";

    import ClassPropertiesTab from "../components/pages/ClassPropertiesTab.svelte";
    import ClassResourcesTab from "../components/pages/ClassResourcesTab.svelte";
    import ItemDescriptionTab from "../components/pages/ItemDescriptionTab.svelte";
    import ItemGrantsTab from "../components/pages/ItemGrantsTab.svelte";
    import ItemSheetHeader from "../components/itemSheetsHeader/ItemSheetHeader.svelte";
    import NavigationBar from "../components/navigation/NavigationBar.svelte";

    export let { document, sheet } = getContext("#external").application;
    export let elementRoot;

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
            label: "A5E.Description",
            component: ItemDescriptionTab,
        },
        {
            name: "properties",
            label: "A5E.ItemSheetLabelPropertiesTab",
            component: ClassPropertiesTab,
        },
        {
            name: "resources",
            label: "A5E.TabResources",
            component: ClassResourcesTab,
        },
        {
            name: "grants",
            label: "A5E.TabGrants",
            component: ItemGrantsTab,
        },
    ];

    let currentTab = tabs[0];

    setContext("item", item);
</script>

<ApplicationShell bind:elementRoot>
    <main on:drop|preventDefault|stopPropagation={(event) => onDrop(event)}>
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

        background: $color-sheet-background;
    }
</style>
