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

    <div class="u-align-center u-flex u-gap-md u-text-sm">
      <h3 class="u-text-sm">
        {{ item.name }}
      </h3>

      <span v-if="item.data.quantity > 1">({{ item.data.quantity }})</span>

      <span v-if="hasUses">
        (
        <span>
          {{ item.data.uses.value || 0 }}
        </span>

        <span v-if="item.data.uses.max"> / </span>
        <span v-if="item.data.uses.max">{{ item.data.uses.max }}</span>

        <span v-if="item.data.uses.per">
          Per
          {{ localize(config.resourceRecoveryOptions[item.data.uses.per]) }}
        </span>
        )
      </span>
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
import { computed, inject, ref } from "vue";

import ItemActionButtons from "./ItemActionButtons.vue";

export default {
  components: { ItemActionButtons },
  props: { item: Object },
  setup(props) {
    const actor = inject("actor");
    const descriptionVisible = ref(false);

    const hasUses = computed(() => {
      const { uses } = props.item.data;
      return uses.value || uses.max;
    });

    function onActivateItem() {
      const item = actor.items.get(props.item._id);
      item.activate();
    }

    function onToggleDescriptionVisibility() {
      descriptionVisible.value = !descriptionVisible.value;
    }

    return {
      config: CONFIG.A5E,
      descriptionVisible,
      hasUses,
      localize: (key) => game.i18n.localize(key),
      onActivateItem,
      onToggleDescriptionVisibility,
    };
  },
};
</script>
