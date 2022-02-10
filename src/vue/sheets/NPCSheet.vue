<template>
  <NPCHeader />

  <player-character-navigation
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
import NPCHeader from "./header/NPCHeader.vue";
import PlayerCharacterNavigation from "./navigation/PlayerCharacterNavigation.vue";

import CorePage from "./pages/CorePage.vue";
import FeaturesPage from "./pages/FeaturesPage.vue";
import InventoryPage from "./pages/InventoryPage.vue";
import SkillsPage from "./pages/SkillsPage.vue";
import SpellsPage from "./pages/SpellsPage.vue";

import { computed, provide, ref, shallowRef } from "vue";

export default {
  inheritAttrs: false,
  components: { NPCHeader, PlayerCharacterNavigation },
  setup(_, context) {
    const { actor, sheet } = context.attrs;
    const { appId } = sheet;
    const data = ref(sheet.getData());

    const tabs = [
      { name: "core", label: "A5E.TabCoreFeatures", comp: CorePage },
      { name: "skills", label: "A5E.TabSkills", comp: SkillsPage },
      { name: "inventory", label: "A5E.TabInventory", comp: InventoryPage },
      { name: "features", label: "A5E.TabFeatures", comp: FeaturesPage },
      { name: "spells", label: "A5E.TabSpells", comp: SpellsPage },
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

    // Register listeners for changes to actor data and embedded items so that the
    // sheet data can be refreshed.
    const registeredListeners = [
      "updateActor",
      "createItem",
      "deleteItem",
      "updateItem",
    ].reduce((hookIDs, hook) => {
      hookIDs[hook] = Hooks.on(hook, () => updateStoredActorData());
      return hookIDs;
    }, {});

    // Unregister the above listeners when the sheet is closed, along with this listener.
    const closeSheetHookID = Hooks.on("closeActorSheet", (sheetData) => {
      if (sheetData.appId === appId) {
        Object.entries(registeredListeners).forEach(([name, id]) => {
          Hooks.off(name, id);
        });

        Hooks.off("closeActorSheet", closeSheetHookID);
      }
    });

    return {
      activeTab,
      data,
      tabs,
      updateActiveTab,
    };
  },
};
</script>
