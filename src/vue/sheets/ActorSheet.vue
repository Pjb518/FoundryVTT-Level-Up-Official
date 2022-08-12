<template>
  <player-character-header />

  <navigation
    :active-tab="activeTab"
    :tabs="tabs"
    @update-active-tab="updateActiveTab"
  />

  <section class="u-flex u-flex-col u-flex-grow u-overflow-y-hidden">
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

import CorePage from "./pages/CorePage.vue";
import ActiveEffectsPage from "./pages/ActiveEffectsPage.vue";
import BiographyPage from "./pages/BiographyPage.vue";
import FeaturesPage from "./pages/FeaturesPage.vue";
import InventoryPage from "./pages/InventoryPage.vue";
import JournalPage from "./pages/JournalPage.vue";
import ManeuversPage from "./pages/ManeuversPage.vue";
import SettingsPage from "./pages/SettingsPage.vue";
import SkillsPage from "./pages/SkillsPage.vue";
import SpellsPage from "./pages/SpellsPage.vue";

export default {
  inheritAttrs: false,
  components: { PlayerCharacterHeader, Navigation },
  setup(_, context) {
    const { actor, sheet } = context.attrs;
    const { appId } = sheet;
    const data = ref(sheet.getData());

    const tabs = computed(() => {
      const initialTabs = [
        {
          name: "core",
          label: "A5E.TabCore",
          comp: CorePage,
        },
        { name: "skills", label: "A5E.TabSkills", comp: SkillsPage },
        { name: "inventory", label: "A5E.TabInventory", comp: InventoryPage },
        { name: "features", label: "A5E.TabFeatures", comp: FeaturesPage },
      ];

      if (data.value.flags.a5e?.showManeuverTab ?? true) {
        initialTabs.push({
          name: "maneuvers",
          label: "A5E.TabManeuvers",
          comp: ManeuversPage,
        });
      }

      if (data.value.flags.a5e?.showSpellTab ?? true) {
        initialTabs.push({
          name: "spells",
          label: "A5E.TabSpells",
          comp: SpellsPage,
        });
      }

      initialTabs.push({
        name: "biography",
        label: "A5E.TabBiography",
        comp: BiographyPage,
      });

      initialTabs.push({
        name: "journal",
        label: "A5E.TabJournal",
        comp: JournalPage,
      });

      initialTabs.push({
        name: "effects",
        label: "Active Effects",
        comp: ActiveEffectsPage,
      });

      initialTabs.push({
        name: "settings",
        label: "A5E.TabSettings",
        comp: SettingsPage,
      });

      return initialTabs;
    });

    const activeTab = shallowRef(tabs.value[0]);
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

    registerSheetListeners({
      appId,
      documentId: actor.parent ? actor.parent.id : actor.id,
      documentType: "Actor",
      hooks: [
        actor.parent ? "updateToken" : "updateActor",
        "createItem",
        "deleteItem",
        "updateItem",
      ],
      updateFunction: updateStoredActorData,
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
