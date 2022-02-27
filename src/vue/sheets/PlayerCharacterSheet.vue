<template>
  <player-character-header />

  <navigation
    :active-tab="activeTab"
    :tabs="tabs"
    @update-active-tab="updateActiveTab"
  />

  <section class="u-h-full u-overflow-y-hidden">
    <keep-alive>
      <component :is="activeTab.comp" />
    </keep-alive>
  </section>
</template>

<script>
import { computed, provide, ref, shallowRef } from "vue";

import registerSheetListeners from "../utils/hookHelpers/registerSheetListeners";

import Navigation from "./navigation/Navigation.vue";
import PlayerCharacterHeader from "./header/PlayerCharacterHeader.vue";

import AttributesPage from "./pages/AttributesPage.vue";
import BiographyPage from "./pages/BiographyPage.vue";
import FeaturesPage from "./pages/FeaturesPage.vue";
import InventoryPage from "./pages/InventoryPage.vue";
import JournalPage from "./pages/JournalPage.vue";
import ManeuversPage from "./pages/ManeuversPage.vue";
import SpellsPage from "./pages/SpellsPage.vue";

export default {
  inheritAttrs: false,
  components: { PlayerCharacterHeader, Navigation },
  setup(_, context) {
    const { actor, sheet } = context.attrs;
    const { appId } = sheet;
    const data = ref(sheet.getData());

    const tabs = [
      { name: "attributes", label: "A5E.TabAttributes", comp: AttributesPage },
      { name: "inventory", label: "A5E.TabInventory", comp: InventoryPage },
      { name: "features", label: "A5E.TabFeatures", comp: FeaturesPage },
      { name: "maneuvers", label: "A5E.TabManeuvers", comp: ManeuversPage },
      { name: "spells", label: "A5E.TabSpells", comp: SpellsPage },
      { name: "biography", label: "A5E.TabBiography", comp: BiographyPage },
      { name: "journal", label: "A5E.TabJournal", comp: JournalPage },
    ];

    const activeTab = shallowRef(tabs[0]);
    const sheetIsLocked = computed(() => data.value.flags?.a5e?.sheetIsLocked);

    provide("actor", actor);
    provide("data", data);
    provide("sheet", sheet);
    provide("sheetIsLocked", sheetIsLocked);

    function updateActiveTab(selectedTab) {
      activeTab.value = selectedTab;
    }

    function updateStoredActorData() {
      data.value = context.attrs.sheet.getData();
    }

    registerSheetListeners(
      appId,
      actor,
      ["updateActor", "createItem", "deleteItem", "updateItem"],
      updateStoredActorData
    );

    return {
      activeTab,
      data,
      tabs,
      updateActiveTab,
    };
  },
};
</script>
