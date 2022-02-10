<template>
  <div>
    <h3
      class="
        u-align-center u-flex u-gap-md u-mb-0 u-pointer u-text-bold u-text-sm
        a5e-form__input-label--filter
      "
      :class="{ 'a5e-form__input-label--active-filter': showFilterOptions }"
      @click="onToggleFilterVisibility"
    >
      {{ localize(heading) }}

      <ul
        class="
          u-flex
          u-flex-wrap
          u-font-san-serif
          u-gap-md
          u-list-style-none
          u-m-0
          u-p-0
          u-gap-xs
          u-text-xxs
        "
      >
        <li v-if="inclusiveCount" class="a5e-tag a5e-tag--tight">
          {{ inclusiveCount }}
        </li>

        <li v-if="exclusiveCount" class="a5e-tag a5e-tag--red a5e-tag--tight">
          {{ exclusiveCount }}
        </li>
      </ul>
    </h3>

    <div v-if="showFilterOptions">
      <ul
        class="
          u-flex
          u-flex-wrap
          u-font-san-serif
          u-gap-md
          u-list-style-none
          u-m-0
          u-mt-md
          u-p-0
          u-text-xs
        "
      >
        <li
          v-for="[value, label] in Object.entries(filterOptions)"
          :key="value"
          class="a5e-tag a5e-tag--tight u-pointer"
          :class="
            !filters?.inclusive?.includes(value) &&
            (filters?.exclusive?.includes(value)
              ? 'a5e-tag--red'
              : 'a5e-tag--inactive')
          "
          @click.prevent="onToggleFilterOption(value)"
        >
          {{ localize(label) }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { computed, inject, ref } from "vue";

export default {
  props: { filterKey: String, filterOptions: Object, heading: String },
  setup(props) {
    const actor = inject("actor");
    const data = inject("data");
    const showFilterOptions = ref(false);

    const filters = computed(() => {
      const flags = data.value.flags?.a5e;
      return flags ? flags[props.filterKey] : {};
    });

    const exclusiveCount = computed(() => {
      const flags = data.value.flags?.a5e;

      if (!flags) return 0;
      return flags[props.filterKey]?.exclusive?.length ?? 0;
    });

    const inclusiveCount = computed(() => {
      const flags = data.value.flags?.a5e;

      if (!flags) return 0;
      return flags[props.filterKey]?.inclusive?.length ?? 0;
    });

    async function onToggleFilterOption(value) {
      await actor.updateFilters(props.filterKey, value);
    }

    function onToggleFilterVisibility() {
      showFilterOptions.value = !showFilterOptions.value;
    }

    return {
      exclusiveCount,
      filters,
      inclusiveCount,
      onToggleFilterOption,
      onToggleFilterVisibility,
      localize: (key) => game.i18n.localize(key),
      showFilterOptions,
    };
  },
};
</script>
