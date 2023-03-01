<svelte:options accessors={true} />

<script>
    import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";
    import { getContext, setContext } from "svelte";

    import ItemActionsTab from "../components/pages/ItemActionsTab.svelte";
    import ItemDescriptionTab from "../components/pages/ItemDescriptionTab.svelte";
    import ItemPropertiesTab from "../components/pages/ItemPropertiesTab.svelte";
    import ItemSheetHeader from "../components/itemSheetsHeader/ItemSheetHeader.svelte";
    import NavigationBar from "../components/navigation/NavigationBar.svelte";
    import ItemGmNotesTab from "../components/pages/ItemGmNotesTab.svelte";

    export let { appId, itemDocument } = getContext("#external").application;
    export let elementRoot;

    function updateCurrentTab(event) {
        currentTab = tabs[event.detail];
    }

    const tabs = [
        {
            name: "description",
            label: "A5E.ItemSheetLabelDescriptionTab",
            component: ItemDescriptionTab,
        },
        {
            name: "properties",
            label: "A5E.ItemSheetLabelPropertiesTab",
            component: ItemPropertiesTab,
        },
        {
            name: "actions",
            label: "A5E.ItemSheetLabelActionsTab",
            component: ItemActionsTab,
        },
    ];

    if (game.user.isGM) {
        tabs.push({
            name: "gmNotes",
            label: "GM Notes",
            component: ItemGmNotesTab,
        });
    }

    $: currentTab = tabs[0];

    setContext("item", new TJSDocument(itemDocument));
    setContext("appId", appId);
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
