<script lang="ts">
  import { setContext } from "svelte";

  import type { Tab } from "#view/navigation/data.ts";
  import NavigationBar from "../navigation/NavigationBar.svelte";

  import ItemSheetHeader from "./components/item/ItemSheetHeader.svelte";
  import ItemSideBar from "./components/item/ItemSideBar.svelte";

  import ItemActionsPage from "./pages/item/ItemActionsPage.svelte";
  import ItemCorePage from "./pages/item/ItemCorePage.svelte";
  import ItemEffectsPage from "./pages/item/ItemEffectsPage.svelte";
  import ItemEquipmentPage from "./pages/item/ItemEquipmentPage.svelte";
  import ItemGrantsPage from "./pages/item/ItemGrantsPage.svelte";
  import ItemMacroPage from "./pages/item/ItemMacroPage.svelte";
  import ItemPropertiesPage from "./pages/item/ItemPropertiesPage.svelte";

  type Props = {
    item: ActionItem;
    sheet: any;
    editable: boolean;
  };

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
        display: canEdit,
      },
      {
        name: "equipment",
        label: "A5E.objects.equipment",
        icon: "fa-solid fa-box-open",
        component: ItemEquipmentPage,
        display: item.type === "object" && itemData.objectType === "container" && canEdit,
      },
      {
        name: "actions",
        label: "A5E.tabs.actions",
        icon: "fa-solid fa-crosshairs",
        component: ItemActionsPage,
        display: canEdit,
      },
      {
        name: "effects",
        label: "A5E.tabs.effects",
        icon: "fa-solid fa-bolt",
        component: ItemEffectsPage,
        display: canEdit,
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
        label: "A5E.tabs.macro",
        icon: "fa-solid fa-terminal",
        component: ItemMacroPage,
        display: [
          "feature",
          "interaction",
          "hacking",
          "maneuver",
          "object",
          "spell",
        ].includes(item.type),
      },
    ];
  }

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

  let { item, sheet, editable }: Props = $props();

  let itemData = $derived(item.reactive.system);
  let canEdit = $derived(editable || game.user?.isGM);

  let tabs = $state(getTabs());
  let currentTab = $derived(tabs[0]);

  setContext("item", item);
  setContext("sheet", sheet);
</script>

<div
  class="a5e-item-sheet"
  ondragover={(e) => e.preventDefault()}
  ondrop={(e) => _onDrop(e)}
>
  <ItemSideBar />

  <main class="a5e-item-sheet__main">
    <ItemSheetHeader />

    <NavigationBar {currentTab} {tabs} showLock={false} onTabChange={updateCurrentTab} />

    <section class="a5e-item-sheet__page">
      <currentTab.component />
    </section>
  </main>
</div>

<style lang="scss">
  .a5e-item-sheet {
    display: grid;
    grid-template-areas: "aside main";
    grid-template-columns: 2fr 4fr;
    grid-template-rows: auto;
    gap: var(--a5e-spacing-sm);
    height: 100%;
    padding-right: 0.25rem;

    &__main {
      grid-area: main;

      position: relative;

      display: grid;
      grid-template-areas:
        "header"
        "primaryNavigation"
        "page";
      grid-template-rows: min-content min-content minmax(0, 1fr);
      gap: var(--a5e-spacing-sm);

      height: 100%;
      min-height: 0;
      width: 100%;

      &__page {
        grid-area: page;
        padding-inline: var(--a5e-spacing-sm);
        height: 100%;
        // min-height: 0;
        overflow-y: auto;
        padding-bottom: var(--a5e-spacing-md);
      }
    }
  }
</style>
