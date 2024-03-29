<svelte:options accessors={true} />

<script>
    import { getContext, setContext } from "svelte";
    import { ApplicationShell } from "#runtime/svelte/component/core";

    import ItemActionsTab from "../components/pages/ItemActionsTab.svelte";
    import ItemDescriptionTab from "../components/pages/ItemDescriptionTab.svelte";
    import ItemPropertiesTab from "../components/pages/ItemPropertiesTab.svelte";
    import ItemSheetHeader from "../components/itemSheetsHeader/ItemSheetHeader.svelte";
    import NavigationBar from "../components/navigation/NavigationBar.svelte";
    import ItemGmNotesTab from "../components/pages/ItemGmNotesTab.svelte";
    import ItemUnidentifiedDescriptionTab from "../components/pages/ItemUnidentifiedDescriptionTab.svelte";
    import ItemEffectsTab from "../components/pages/ItemEffectsTab.svelte";
    import ItemEquipmentTab from "../components/pages/ItemEquipmentTab.svelte";
    import getSummaryData from "../../utils/summaries/getSummaryData";
    import ItemGrantsTab from "../components/pages/ItemGrantsTab.svelte";

    export let { appId, document, sheet } = getContext("#external").application;
    export let elementRoot;

    function updateCurrentTab(event) {
        currentTab = tabs[event.detail];
    }

    const item = document;

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
            label: "A5E.ItemSheetLabelDescriptionTab",
            component: ItemDescriptionTab,
            display: !$item.system.unidentified || game.user.isGM,
        },
        {
            name: "unidentifiedDescription",
            label: "A5E.ItemSheetLabelUnidentifiedDescriptionTab",
            component: ItemUnidentifiedDescriptionTab,
            display:
                $item.type === "object" &&
                ($item.system.unidentified || game.user.isGM),
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
            name: "equipment",
            label: "A5E.Equipment",
            component: ItemEquipmentTab,
            display:
                $item.type === "object" &&
                $item.system.objectType === "container" &&
                (!$item.system.unidentified || game.user.isGM),
        },
        {
            name: "actions",
            label: "A5E.ItemSheetLabelActionsTab",
            component: ItemActionsTab,
            display: !$item.system.unidentified || game.user.isGM,
        },
        {
            name: "effects",
            label: "A5E.TabEffects",
            component: ItemEffectsTab,
            display: !$item.system.unidentified || game.user.isGM,
        },
        {
            name: "grants",
            label: "A5E.TabGrants",
            component: ItemGrantsTab,
            display: $item.type === "feature",
        },
    ];

    let currentTab =
        $item.system?.unidentified && !game.user.isGM ? tabs[1] : tabs[0];

    setContext("item", item);
    setContext("appId", appId);

    $: summaryData = getSummaryData($item);
</script>

<ApplicationShell bind:elementRoot>
    <main on:drop|preventDefault|stopPropagation={(event) => onDrop(event)}>
        <ItemSheetHeader />

        <NavigationBar {currentTab} {tabs} on:tab-change={updateCurrentTab} />

        <svelte:component this={currentTab.component} {summaryData} />
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
