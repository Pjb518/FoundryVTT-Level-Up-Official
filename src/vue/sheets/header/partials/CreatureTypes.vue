<template>
  <div
    class="u-flex u-gap-ch u-align-center"
    :class="{ 'u-mr-md': sheetIsLocked }"
  >
    <h2 class="u-font-sans-serif u-text-bold u-text-sm u-w-fit">
      {{ localize("A5E.CreatureTypesLabel") }}:
    </h2>

    <ul
      v-if="creatureTypes.length"
      class="
        u-comma-list
        u-flex
        u-flex-wrap
        u-font-san-serif
        u-gap-ch
        u-list-style-none
        u-m-0
        u-p-0
        u-text-sm
      "
    >
      <li v-for="creatureType in creatureTypes" :key="creatureType">
        {{ localize(config.creatureTypes[creatureType] ?? creatureType) }}
      </li>
    </ul>

    <span v-else>
      {{ localize("A5E.None") }}
    </span>

    <i
      v-if="!sheetIsLocked"
      class="a5e-config-button fas fa-cog"
      @click="onConfigureCreatureTypes"
    ></i>
  </div>
</template>

<script>
import { inject } from "vue";

export default {
  props: { sheetIsLocked: Boolean, creatureTypes: Array },
  setup() {
    const actor = inject("actor");

    function onConfigureCreatureTypes() {
      actor.configureCreatureTypes();
    }

    return {
      config: CONFIG.A5E,
      localize: (key) => game.i18n.localize(key),
      onConfigureCreatureTypes,
    };
  },
};
</script>
