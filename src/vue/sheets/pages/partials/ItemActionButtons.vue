<template>
  <div class="u-align-center u-flex u-gap-xl u-ml-auto u-mr-md">
    <i
      class="u-hover-scale-120 u-transition fas fa-bookmark"
      :class="
        item.system.favorite
          ? 'u-text-green'
          : 'u-hover-text-green u-text-medium'
      "
      @click.stop="onMarkItemAsFavorite"
    ></i>

    <i
      v-if="item.type === 'object'"
      class="u-hover-scale-120 u-transition fas fa-shield-alt"
      :class="
        item.system.equipped
          ? 'u-text-green'
          : 'u-hover-text-green u-text-medium'
      "
      @click.stop="onEquipItem"
    ></i>

    <i
      v-if="item.type === 'spell'"
      class="u-hover-scale-120 u-transition fas fa-scroll"
      :class="
        item.system.prepared
          ? 'u-text-green'
          : 'u-hover-text-green u-text-medium'
      "
      @click.stop="onPrepareSpell"
    ></i>

    <i
      class="
        u-hover-scale-120 u-hover-text-green u-text-medium u-transition
        fas
        fa-pen
      "
      @click.stop="onEditItem"
    ></i>

    <i
      v-if="!sheetIsLocked"
      class="
        u-hover-scale-120 u-hover-text-red u-text-medium u-transition
        fas
        fa-trash
      "
      @click.stop="onDeleteItem"
    ></i>
  </div>
</template>

<script>
import { inject } from "vue";

export default {
  props: { item: Object },
  setup(props) {
    const actor = inject("actor");
    const sheetIsLocked = inject("sheetIsLocked");

    function onDeleteItem() {
      actor.deleteEmbeddedDocuments("Item", [props.item._id]);
    }

    function onEditItem() {
      actor.items.get(props.item._id).sheet.render(true);
    }

    function onEquipItem() {
      const item = actor.items.get(props.item._id);
      item.update({ "system.equipped": !item.system.equipped });
    }

    function onMarkItemAsFavorite() {
      const item = actor.items.get(props.item._id);
      item.update({ "system.favorite": !item.system.favorite });
    }

    function onPrepareSpell() {
      const item = actor.items.get(props.item._id);
      item.update({ "system.prepared": !item.system.prepared });
    }

    return {
      onDeleteItem,
      onEditItem,
      onEquipItem,
      onMarkItemAsFavorite,
      onPrepareSpell,
      sheetIsLocked,
    };
  },
};
</script>
