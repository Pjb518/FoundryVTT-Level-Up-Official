<template>
  <section
    class="
      a5e-box
      u-flex
      u-flex-col
      u-flex-shrink-0
      u-font-secondary
      u-gap-md
      u-p-md
      u-rounded
      u-w-60
    "
    :class="tab === 'features' ? 'u-mb-lg' : 'u-mb-xl'"
  >
    <h2 class="u-border-none u-font-serif u-text-lg u-w-full u-text-center">
      {{ localize("A5E.Filters") }}
    </h2>

    <div class="u-flex u-flex-col u-gap-md u-p-md u-h-full u-overflow-y-auto">
      <slot></slot>
    </div>

    <a
      class="a5e-button a5e-button--filter-reset a5e-js-reset-filters"
      @click="onResetFilters"
    >
      {{ localize("A5E.FiltersReset") }}
    </a>
  </section>
</template>

<script>
import { inject } from "vue";

export default {
  props: { tab: { type: String, default: null } },
  setup(props) {
    const actor = inject("actor");

    async function onResetFilters() {
      await actor.resetFilters(props.tab);
    }

    return {
      localize: (key) => game.i18n.localize(key),
      onResetFilters,
    };
  },
};
</script>
