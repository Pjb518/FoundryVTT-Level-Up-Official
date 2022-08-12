<template>
  <section class="u-flex u-flex-col u-p-lg u-h-full u-overflow-y-auto">
    <header
      class="
        u-border-b
        u-border-gray
        u-flex
        u-justify-space-between
        u-mr-xl
        u-mb-md
        u-pb-md
        u-px-md
      "
    >
      <h3 class="u-border-none u-font-serif u-text-lg u-w-full u-w-fit">
        Active Effects
      </h3>

      <a
        v-if="!sheetIsLocked"
        class="a5e-button a5e-button--add-item"
        @click="onCreateItem"
      >
        + {{ localize("A5E.ItemAdd") }}
      </a>
    </header>
    <section class="u-h-full u-overflow-y-auto">
      <ul
        class="
          u-flex-shrink-0 u-gap-xs u-grid u-grid-3 u-list-style-none u-m-0 u-p-0
        "
      >
        <effect
          v-for="[label, effect] in effects"
          :key="label"
          :label="label"
          :effect="effect"
        />
      </ul>
    </section>
  </section>
</template>


<script>
import { computed, inject, onMounted } from "vue";

import Effect from "./partials/Effect.vue";

export default {
  components: { Effect },
  setup() {
    const actor = inject("actor");
    const data = inject("data");
    const sheet = inject("sheet");
    const sheetIsLocked = inject("sheetIsLocked");

    const effects = computed(() =>
      Array.from(actor.effects.entries()).map((elem) => {
        elem[0] = elem[1].label;
        return elem;
      })
    );

    async function onCreateItem() {
      const newItems = await actor.createEmbeddedDocuments("ActiveEffect", [
        {
          label: game.i18n.localize("A5E.ItemNew"),
          origin: actor.uuid,
        },
      ]);

      newItems[0].sheet.render(true);
    }

    onMounted(() => {
      sheet.activateVueListeners($(sheet.form));
    });

    return {
      config: CONFIG.A5E,
      data,
      effects,
      localize: (key) => game.i18n.localize(key),
      onCreateItem,
      sheetIsLocked,
    };
  },
};
</script>
