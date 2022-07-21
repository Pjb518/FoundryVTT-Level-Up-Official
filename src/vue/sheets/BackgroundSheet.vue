<template>
  <item-header />

  <navigation
    :active-tab="activeTab"
    :tabs="tabs"
    @update-active-tab="updateActiveTab"
  />

  <section
    class="u-flex u-flex-col u-flex-grow u-overflow-y-auto"
    :class="{ 'u-p-lg': activeTab.name !== 'description' }"
  >
    <keep-alive>
      <component :is="activeTab.comp" />
    </keep-alive>
  </section>
</template>

<script>
import { provide, ref, shallowRef } from "vue";

import registerSheetListeners from "../utils/hookHelpers/registerSheetListeners";

import ItemHeader from "./header/ItemHeader.vue";
import ItemDescriptionPage from "./pages/ItemDescriptionPage.vue";
import ItemDetailsPage from "./pages/ItemDetailsPage.vue";
import Navigation from "./navigation/Navigation.vue";

export default {
  inheritAttrs: false,
  components: { ItemDescriptionPage, ItemDetailsPage, ItemHeader, Navigation },
  setup(_, context) {
    const { actor, item, sheet } = context.attrs;
    const { appId } = sheet;
    const data = ref(sheet.getData());

    const tabs = [
      {
        name: "description",
        label: "A5E.Description",
        comp: ItemDescriptionPage,
      },
    ];

    const activeTab = shallowRef(tabs[0]);

    provide("actor", actor);
    provide("appId", appId);
    provide("data", data);
    provide("item", item);

    function updateActiveTab(selectedTab) {
      activeTab.value = selectedTab;
    }

    function updateStoredItemData() {
      data.value = context.attrs.sheet.getData();
    }

    registerSheetListeners({
      appId,
      documentId: item.id,
      documentName: "Item",
      hooks: ["updateItem"],
      updateFunction: updateStoredItemData,
    });

    return {
      activeTab,
      tabs,
      updateActiveTab,
    };
  },
};
</script>
