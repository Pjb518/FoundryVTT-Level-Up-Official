<template>
  <li
    class="a5e-box a5e-item a5e-js-item"
    :class="{ 'u-bg-light-green': item.data.equipped || item.data.prepared }"
    :data-id="item._id"
    :data-item-id="item._id"
    draggable="true"
    @click.prevent="onToggleDescriptionVisibility"
  >
    <img
      :src="item.img"
      :title="item.name"
      class="a5e-image a5e-image--item-inline"
      @click.stop="onActivateItem"
    />

    <div>
      <h3 class="u-text-sm">
        {{ item.name }}
      </h3>
      <span v-if="item.showQuantity">({{ item.data.quantity }})</span>
    </div>

    <item-action-buttons :item="item" />

    <div v-if="descriptionVisible" class="a5e-item__details">
      <hr class="a5e-rule" />

      <div v-html="item.data.description" v-if="item.data.description"></div>

      <div v-else>
        {{ localize("A5E.NoDescription") }}
      </div>
    </div>
  </li>
</template>

<script>
import { inject, ref } from "vue";

import ItemActionButtons from "./ItemActionButtons.vue";

export default {
  components: { ItemActionButtons },
  props: { item: Object },
  setup(props) {
    const actor = inject("actor");
    const descriptionVisible = ref(false);

    function onActivateItem() {
      const item = actor.items.get(props.item._id);
      item.activate();
    }

    function onToggleDescriptionVisibility() {
      descriptionVisible.value = !descriptionVisible.value;
    }

    return {
      descriptionVisible,
      localize: (key) => game.i18n.localize(key),
      onActivateItem,
      onToggleDescriptionVisibility,
    };
  },
};
</script>
