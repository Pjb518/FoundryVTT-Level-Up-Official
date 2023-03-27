<svelte:options accessors={true} />

<script>
    import { getContext, setContext } from "svelte";
    import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";

    import ItemActionsTab from "../components/pages/ItemActionsTab.svelte";
    import ItemDescriptionTab from "../components/pages/ItemDescriptionTab.svelte";
    import ItemPropertiesTab from "../components/pages/ItemPropertiesTab.svelte";
    import ItemSheetHeader from "../components/itemSheetsHeader/ItemSheetHeader.svelte";
    import NavigationBar from "../components/navigation/NavigationBar.svelte";
    import ItemGmNotesTab from "../components/pages/ItemGmNotesTab.svelte";
    import ItemUnidentifiedDescriptionTab from "../components/pages/ItemUnidentifiedDescriptionTab.svelte";

    export let { appId, document, sheet } = getContext("#external").application;
    export let elementRoot;

    function updateCurrentTab(event) {
        currentTab = tabs[event.detail];
    }

    const item = document;

    // **********************************************
    // Drag Drop Handlers
    async function onDrop(event) {
        const transferData = event.dataTransfer.getData("text/plain");
        if (!transferData) return;

        const dragData = JSON.parse(transferData);
        sheet._onDropDocument(dragData);
    }

    const tabs = [
        {
            name: "description",
            label: "A5E.ItemSheetLabelDescriptionTab",
            component: ItemDescriptionTab,
            display: !$item.system.unidentified || game.user.isGM,
        },
        {
            name: "unidentifiedDescription",
            label: "A5E.ItemSheetLabelUnidentifiedDescriptionTab",
            component: ItemUnidentifiedDescriptionTab,
            display: $item.system.unidentified || game.user.isGM,
        },
        {
            name: "gmNotes",
            label: "GM Notes",
            component: ItemGmNotesTab,
            display: game.user.isGM,
        },
        {
            name: "properties",
            label: "A5E.ItemSheetLabelPropertiesTab",
            component: ItemPropertiesTab,
            display: !$item.system.unidentified || game.user.isGM,
        },
        {
            name: "actions",
            label: "A5E.ItemSheetLabelActionsTab",
            component: ItemActionsTab,
            display: !$item.system.unidentified || game.user.isGM,
        },
    ];

    let currentTab =
        $item.system?.unidentified && !game.user.isGM ? tabs[1] : tabs[0];

    setContext("item", item);
    setContext("appId", appId);
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

        background: rgba(246, 242, 235, 0.5);
    }
</style>
