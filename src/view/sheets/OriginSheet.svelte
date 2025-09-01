<script lang="ts">
    import { setContext } from "svelte";

    import type { Tab } from "#view/navigation/data.ts";

    import ItemSheetHeader from "./components/item/ItemSheetHeader.svelte";
    import NavigationBar from "#view/navigation/NavigationBar.svelte";

    import ArchetypePropertiesTab from "./pages/item/ArchetypePropertiesTab.svelte";
    import ItemCorePage from "./pages/item/ItemCorePage.svelte";
    import ItemGrantsPage from "./pages/item/ItemGrantsPage.svelte";

    type Props = {
        item: any;
        sheet: any;
    };

    function getTabs() {
        return [
            {
                name: "core",
                label: "A5E.TabCore",
                icon: "fa-solid fa-home",
                component: ItemCorePage,
            },
            // Archetype Properties
            {
                name: "archetypeProperties",
                label: "A5E.TabProperties",
                icon: "fa-solid fa-table-list",
                component: ArchetypePropertiesTab,
                display: item.type === "archetype",
            },
            // Class Properties
            {
                name: "classProperties",
                label: "A5E.TabProperties",
                icon: "fa-solid fa-table-list",
                component: null,
                display: item.type === "class",
            },
            // Resources
            {
                name: "resources",
                label: "A5E.TabResources",
                icon: "fa-solid fa-dice-d20",
                component: null,
                display: ["archetype", "class"].includes(item.type),
            },
            // Grants
            {
                name: "grants",
                label: "A5E.TabGrants",
                icon: "fa-solid fa-gift",
                component: ItemGrantsPage,
            },
        ];
    }

    function updateCurrentTab(name: string) {
        const newTabName = name ?? "core";
        currentTab = tabs.find((tab) => tab.name === newTabName) ?? tabs[0];
    }

    let { item, sheet }: Props = $props();

    let itemStore = $state(item.reactive.system);

    let tabs = $state(getTabs());
    let currentTab: Tab = $derived(tabs[0]);

    setContext("item", item);
    setContext("sheet", sheet);
</script>
