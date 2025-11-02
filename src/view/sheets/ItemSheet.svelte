<script lang="ts">
    import { setContext } from "svelte";

    import type { Tab } from "#view/navigation/data.ts";

    import ItemSheetHeader from "./components/item/ItemSheetHeader.svelte";
    import NavigationBar from "../navigation/NavigationBar.svelte";

    import ItemActionsPage from "./pages/item/ItemActionsPage.svelte";
    import ItemCorePage from "./pages/item/ItemCorePage.svelte";
    import ItemEffectsPage from "./pages/item/ItemEffectsPage.svelte";
    import ItemEquipmentPage from "./pages/item/ItemEquipmentPage.svelte";
    import ItemGrantsPage from "./pages/item/ItemGrantsPage.svelte";
    import ItemMacroPage from "./pages/item/ItemMacroPage.svelte";
    import ItemPropertiesPage from "./pages/item/ItemPropertiesPage.svelte";

    type Props = {
        item: any;
        sheet: any;
    };

    let { item, sheet }: Props = $props();

    async function _onDrop(
        event: DragEvent & {
            currentTarget: EventTarget & HTMLElement;
        },
    ) {
        event.preventDefault();
        event.stopPropagation();

        const transferData = event.dataTransfer?.getData("text/plain");
        if (!transferData) return;

        const dragData = JSON.parse(transferData);
        sheet._onDropDocument(dragData);
    }

    function updateCurrentTab(name: string) {
        const newTabName = name ?? "core";

        currentTab = tabs.find((tab) => tab.name === newTabName) ?? tabs[0];
    }

    function getTabs(): Tab[] {
        return [
            {
                name: "core",
                label: "A5E.tabs.core",
                icon: "fa-solid fa-home",
                component: ItemCorePage,
            },
            {
                name: "properties",
                label: "A5E.tabs.properties",
                icon: "fa-solid fa-table-list",
                component: ItemPropertiesPage,
                display: itemStore.unidentified || game.user?.isGM,
            },
            {
                name: "equipment",
                label: "A5E.Equipment",
                icon: "fa-solid fa-box-open",
                component: ItemEquipmentPage,
                display:
                    item.type === "object" &&
                    itemStore.objectType === "container" &&
                    (itemStore.unidentified || game.user?.isGM),
            },
            {
                name: "actions",
                label: "A5E.TabActions",
                icon: "fa-solid fa-crosshairs",
                component: ItemActionsPage,
                display: itemStore.unidentified || game.user?.isGM,
            },
            {
                name: "effects",
                label: "A5E.tabs.effects",
                icon: "fa-solid fa-bolt",
                component: ItemEffectsPage,
                display: itemStore.unidentified || game.user?.isGM,
            },
            {
                name: "grants",
                label: "A5E.tabs.grants",
                icon: "fa-solid fa-gift",
                component: ItemGrantsPage,
                display: item.type === "feature",
            },
            {
                name: "macro",
                label: "A5E.TabMacro",
                icon: "fa-solid fa-terminal",
                component: ItemMacroPage,
                display: ["feature", "maneuver", "object", "spell"].includes(item.type),
            },
        ];
    }

    let itemStore: any = $derived(item.reactive.system);

    let tabs = $state(getTabs());
    let currentTab = $derived(tabs[0]);

    setContext("item", item);
    setContext("sheet", sheet);
</script>

<main class="a5e-item-sheet" ondrop={(e) => _onDrop(e)}>
    <ItemSheetHeader />

    <NavigationBar {currentTab} {tabs} showLock={false} onTabChange={updateCurrentTab} />

    <section class="a5e-item-sheet__page">
        <currentTab.component />
    </section>
</main>

<style lang="scss">
    .a5e-item-sheet {
        position: relative;
        width: 100%;
        height: 100%;

        display: grid;
        grid-template-areas:
            "header"
            "primaryNavigation"
            "secondaryNavigation"
            "page";
        grid-template-rows: min-content min-content min-content 1fr;
        gap: 0.5rem;

        padding-inline: 0.5rem;
        padding-block: 0.5rem;

        &__page {
            grid-area: page;
            overflow-y: auto;
        }
    }
</style>
