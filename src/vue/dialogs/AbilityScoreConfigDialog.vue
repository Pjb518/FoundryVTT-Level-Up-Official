<template>
  <header class="u-px-lg u-py-xl">
    <h1 class="u-font-serif u-text-xl">{{ heading }}</h1>
  </header>

  <navigation
    :active-tab="activeTab"
    :tabs="tabs"
    @update-active-tab="updateActiveTab"
  />

  <section class="u-h-full u-overflow-y-auto u-p-lg">
    <keep-alive>
      <component :is="activeTab.comp" />
    </keep-alive>
  </section>
</template>

<script>
import { provide, ref, shallowRef } from "vue";

import registerDialogListeners from "../utils/hookHelpers/registerDialogListeners";

import AbilityCheckConfig from "./partials/AbilityCheckConfig.vue";
import Navigation from "../sheets/navigation/Navigation.vue";
import SavingThrowConfig from "./partials/SavingThrowConfig.vue";

export default {
  inheritAttrs: false,
  components: { AbilityCheckConfig, Navigation, SavingThrowConfig },
  setup(_, context) {
    const { actor, ability, appWindow } = context.attrs;
    const appId = appWindow.id;
    const data = ref(actor.sheet.getData());

    const tabs = [
      {
        name: "abilityCheck",
        label: "A5E.TabAbilityCheck",
        comp: AbilityCheckConfig,
      },
      {
        name: "savingThrow",
        label: "A5E.TabSavingThrow",
        comp: SavingThrowConfig,
      },
    ];

    const activeTab = shallowRef(tabs[0]);

    provide("ability", ability);
    provide("actor", actor);
    provide("data", data);
    provide("dialog", appWindow);

    function updateActiveTab(selectedTab) {
      activeTab.value = selectedTab;
    }

    function updateStoredActorData() {
      data.value = actor.sheet.getData();
    }

    registerDialogListeners(
      appId,
      actor,
      ["updateActor"],
      updateStoredActorData
    );

    return {
      ability,
      activeTab,
      heading: game.i18n.format("A5E.AbilityConfiguration", {
        ability: game.i18n.localize(CONFIG.A5E.abilities[ability]),
      }),
      tabs,
      updateActiveTab,
    };
  },
};
</script>
