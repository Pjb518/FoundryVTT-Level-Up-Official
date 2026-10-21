<script lang="ts">
  import { setContext } from "svelte";

  import type { Tab } from "#view/navigation/data.ts";
  import NavigationBar from "#view/navigation/NavigationBar.svelte";
  import ItemSheetHeader from "./components/item/ItemSheetHeaderOld.svelte";

  import ArchetypePropertiesPage from "./pages/item/ArchetypePropertiesPage.svelte";
  import ClassPropertiesPage from "./pages/item/ClassPropertiesPage.svelte";
  import DestinyFeaturesPage from "./pages/item/DestinyFeaturesPage.svelte";
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
        label: "A5E.tabs.core",
        icon: "fa-solid fa-home",
        component: OriginCorePage,
      },
      // Archetype Properties
      {
        name: "archetypeProperties",
        label: "A5E.tabs.properties",
        icon: "fa-solid fa-table-list",
        component: ArchetypePropertiesPage,
        display: item.type === "archetype",
      },
      // Class Properties
      {
        name: "classProperties",
        label: "A5E.tabs.properties",
        icon: "fa-solid fa-table-list",
        component: ClassPropertiesPage,
        display: item.type === "class",
      },
      {
        name: "destinyFeatures",
        label: "A5E.tabs.grants",
        icon: "fa-solid fa-gift",
        component: DestinyFeaturesPage,
        display: item.type === "destiny",
      },
      // Resources
      {
        name: "resources",
        label: "A5E.tabs.resources",
        icon: "fa-solid fa-dice-d20",
        component: OriginResourcesPage,
        display: ["archetype", "class"].includes(item.type),
      },
      // Grants
      {
        name: "grants",
        label: "A5E.tabs.grants",
        icon: "fa-solid fa-gift",
        component: ItemGrantsPage,
        display: item.type !== "destiny",
      },
    ];
  }

  async function _onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    const transferData = event.dataTransfer?.getData("text/plain");
    if (!transferData) return;

    let dragData;
    try {
      dragData = JSON.parse(transferData);
    } catch {
      return;
    }

    await sheet._onDropDocument(dragData);
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

<main class="a5e-origin-sheet" ondragover={(e) => e.preventDefault()} ondrop={_onDrop}>
  <ItemSheetHeader />

  <NavigationBar {currentTab} {tabs} showLock={false} onTabChange={updateCurrentTab} />

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
    gap: var(--a5e-spacing-sm);

    padding-block: 0.5rem;
    padding-inline: var(--a5e-spacing-sm);

    &__page {
      grid-area: page;
      overflow-y: auto;
      padding-block: 0.75rem;
    }
  }
</style>
