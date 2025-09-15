<script lang="ts">
    import { setContext } from "svelte";

    import type { Tab } from "#view/navigation/data.ts";

    import ItemSheetHeader from "./components/item/ItemSheetHeader.svelte";
    import NavigationBar from "#view/navigation/NavigationBar.svelte";

    import ArchetypePropertiesPage from "./pages/item/ArchetypePropertiesPage.svelte";
    import ClassPropertiesPage from "./pages/item/ClassPropertiesPage.svelte";
    import ItemGrantsPage from "./pages/item/ItemGrantsPage.svelte";
    import OriginCorePage from "./pages/item/OriginCorePage.svelte";
    import OriginResourcesPage from "./pages/item/OriginResourcesPage.svelte";

    type Props = {
        item: any;
        sheet: any;
    };

    function getTabs(): Tab[] {
        return [
            {
                name: "core",
                label: "A5E.TabCore",
                icon: "fa-solid fa-home",
                component: OriginCorePage,
            },
            // Archetype Properties
            {
                name: "archetypeProperties",
                label: "A5E.TabProperties",
                icon: "fa-solid fa-table-list",
                component: ArchetypePropertiesPage,
                display: item.type === "archetype",
            },
            // Class Properties
            {
                name: "classProperties",
                label: "A5E.TabProperties",
                icon: "fa-solid fa-table-list",
                component: ClassPropertiesPage,
                display: item.type === "class",
            },
            // Resources
            {
                name: "resources",
                label: "A5E.TabResources",
                icon: "fa-solid fa-dice-d20",
                component: OriginResourcesPage,
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
    let currentTab = $derived(tabs[0]);

    setContext("item", item);
    setContext("sheet", sheet);
</script>

<main class="a5e-origin-sheet">
    <ItemSheetHeader />

    <NavigationBar
        {currentTab}
        {tabs}
        showLock={false}
        onTabChange={updateCurrentTab}
    />

    <section class="a5e-origin-sheet__page">
        <currentTab.component />
    </section>
</main>

<style lang="scss">
    .a5e-origin-sheet {
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
