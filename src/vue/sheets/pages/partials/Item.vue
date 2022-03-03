<template>
  <li
    class="a5e-box a5e-item a5e-js-item u-align-center"
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

    <div class="u-flex u-flex-col u-gap-xs u-py-xs">
      <div class="u-align-center u-flex u-gap-xl u-text-sm">
        <div class="u-align-center u-flex u-gap-md u-text-xs">
          <h3 class="u-align-center u-flex u-h-5 u-text-sm">
            {{ item.name }}
          </h3>

          <div v-if="item.data.quantity > 1">
            <input
              class="a5e-input a5e-input--inline-item"
              type="number"
              @click.stop=""
              v-model="quantity"
              v-autowidth
              min="0"
            />
          </div>
        </div>

        <div v-if="hasUses" class="u-align-center u-flex u-gap-ch u-text-xs">
          <input
            class="a5e-input a5e-input--inline-item"
            type="number"
            @click.stop=""
            v-model="usesRemaining"
            v-autowidth
            min="0"
          />

          <span v-if="item.data.uses.max"> / </span>

          <input
            v-if="item.data.uses.max"
            class="a5e-input a5e-input--inline-item"
            type="number"
            @click.stop=""
            v-model="maxUses"
            v-autowidth
            min="0"
          />

          <span v-if="item.data.uses.per">
            Per
            {{ localize(config.resourceRecoveryOptions[item.data.uses.per]) }}
          </span>
        </div>
      </div>

      <feature-item-tags v-if="item.type === 'feature'" :item="item" />
      <maneuver-item-tags v-if="item.type === 'maneuver'" :item="item" />
      <object-item-tags v-if="item.type === 'object'" :item="item" />
      <spell-item-tags v-if="item.type === 'spell'" :item="item" />
    </div>

    <item-action-buttons :item="item" />

    <div v-if="descriptionVisible" class="a5e-item__details">
      <hr class="a5e-rule" />

      <spell-item-details v-if="item.type === 'spell'" :item="item" />
      <hr v-if="item.type === 'spell'" class="a5e-rule" />

      <div
        v-html="item.data.description"
        v-if="item.data.description"
        class="a5e-editor"
      ></div>

      <div v-else>
        {{ localize("A5E.NoDescription") }}
      </div>
    </div>
  </li>
</template>

<script>
import { computed, inject, ref } from "vue";
import { directive as VueInputAutowidth } from "vue-input-autowidth";

import FeatureItemTags from "./itemTags/FeatureItemTags.vue";
import ItemActionButtons from "./ItemActionButtons.vue";
import ManeuverItemTags from "./itemTags/ManeuverItemTags.vue";
import ObjectItemTags from "./itemTags/ObjectItemTags.vue";
import SpellItemDetails from "./itemDetails/SpellItemDetails.vue";
import SpellItemTags from "./itemTags/SpellItemTags.vue";

export default {
  components: {
    FeatureItemTags,
    ItemActionButtons,
    ManeuverItemTags,
    ObjectItemTags,
    SpellItemDetails,
    SpellItemTags,
  },
  directives: { autowidth: VueInputAutowidth },
  props: { item: Object },
  setup(props) {
    const actor = inject("actor");
    const descriptionVisible = ref(false);

    const hasUses = computed(() => {
      const { uses } = props.item.data;
      return uses.value || uses.max;
    });

    const maxUses = computed({
      get: () => {
        const item = actor.items.get(props.item._id);
        return item.data.data.uses.max;
      },
      set: (value) => {
        const item = actor.items.get(props.item._id);
        item.update({ "data.uses.max": value });
      },
    });

    const quantity = computed({
      get: () => {
        const item = actor.items.get(props.item._id);
        return item.data.data.quantity;
      },
      set: (value) => {
        const item = actor.items.get(props.item._id);
        item.update({ "data.quantity": value });
      },
    });

    const usesRemaining = computed({
      get: () => {
        const item = actor.items.get(props.item._id);
        return item.data.data.uses.value || 0;
      },
      set: (value) => {
        const item = actor.items.get(props.item._id);
        item.update({ "data.uses.value": value });
      },
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
      maxUses,
      onActivateItem,
      onToggleDescriptionVisibility,
      quantity,
      usesRemaining,
    };
  },
};
</script>
